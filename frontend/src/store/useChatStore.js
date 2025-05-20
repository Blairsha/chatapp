import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  // Состояние хранилища
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  error: null,

  // Получение списка пользователей
  getUsers: async () => {
    set({ isUsersLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data || [] });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: error.response?.data?.error || "Failed to load users" });
      toast.error("Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Получение сообщений для выбранного пользователя
  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data || [] });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.response?.data?.error || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Отправка сообщения (текст или изображение)
sendMessage: async (formData) => {
  const { selectedUser, messages } = get();
  if (!selectedUser) {
    toast.error("No user selected");
    return;
  }

  // Создаем временное сообщение
  const tempMessage = {
    _id: `temp-${Date.now()}`,
    content: formData.get('content'),
    imageUrl: formData.get('image') ? URL.createObjectURL(formData.get('image')) : null,
    senderId: useAuthStore.getState().authUser._id,
    receiverId: selectedUser._id,
    createdAt: new Date().toISOString(),
    status: "sending"
  };

  set({ messages: [...messages, tempMessage] });

  try {
    const response = await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    set((state) => ({
      messages: state.messages.map(msg => 
        msg._id === tempMessage._id ? response.data : msg
      )
    }));
    
    return response.data;
  } catch (error) {
    set((state) => ({
      messages: state.messages.map(msg => 
        msg._id === tempMessage._id ? { ...msg, status: "failed" } : msg
      )
    }));
    throw error;
  }
},

  // Подписка на новые сообщения через WebSocket
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (socket) {
      const handleNewMessage = (newMessage) => {
        if (newMessage.senderId === selectedUser._id || 
            newMessage.receiverId === selectedUser._id) {
          set((state) => ({ 
            messages: [...state.messages, newMessage] 
          }));
        }
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  },

  // Отписка от сообщений
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  // Установка выбранного пользователя
  setSelectedUser: (user) => {
    set({ selectedUser: user, messages: [] });
  },

  // Очистка временных сообщений
  clearOptimisticMessages: () => {
    set((state) => ({
      messages: state.messages.filter(msg => !msg.isOptimistic)
    }));
  },

  // Сброс ошибок
  clearError: () => {
    set({ error: null });
  }
}));