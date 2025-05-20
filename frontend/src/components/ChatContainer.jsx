import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Image, Send, X } from "lucide-react";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { motion, AnimatePresence } from "framer-motion";



const ChatContainer = () => {
  const { 
    selectedUser, 
    messages, 
    getMessages, 
    sendMessage, 
    subscribeToMessages, 
    unsubscribeFromMessages,
    isMessagesLoading,
    error
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const { chatBackground, chatBackgroundOpacity, bubbleColor } = useThemeStore();
  
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [inputError, setInputError] = useState(null);
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Подгрузка сообщений при выборе пользователя
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Автоскролл к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Обработка ошибок
  useEffect(() => {
    if (error) {
      setInputError(error);
      const timer = setTimeout(() => setInputError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Стили для сообщений
  const getBubbleStyle = (isSent) => {
    const base = "max-w-xs lg:max-w-md px-4 py-2 shadow-sm transition-all duration-200";
    
    if (isSent) {
      return bubbleColor.bg.startsWith('#') 
        ? `${base} text-white rounded-2xl rounded-br-none` 
        : `${base} ${bubbleColor.bg} text-white rounded-2xl rounded-br-none`;
    }
    
    return `${base} bg-base-300 text-base-content rounded-2xl rounded-bl-none`;
  };

  // Отправка сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!text.trim() && !imagePreview) {
      setInputError("Пожалуйста, введите сообщение или выберите изображение");
      return;
    }
    
    setIsSending(true);
    setInputError(null);
    
    try {
      const formData = new FormData();
      if (text.trim()) formData.append('content', text.trim());
      if (imagePreview) formData.append('image', fileInputRef.current.files[0]);
      formData.append('receiverId', selectedUser._id);
      formData.append('senderId', authUser._id);

      await sendMessage(formData);
      
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      setInputError(error.response?.data?.error || "Не удалось отправить сообщение");
    } finally {
      setIsSending(false);
    }
  };

  // Обработка выбора изображения
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      setInputError("Разрешены только изображения (JPEG, PNG, GIF, WebP)");
      return;
    }
    
    if (file.size > MAX_SIZE) {
      setInputError(`Размер изображения не должен превышать ${MAX_SIZE/1024/1024}MB`);
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Удаление превью изображения
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Если чат не выбран
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-100">
        <div className="text-center p-6 max-w-md">
          <h3 className="text-xl font-medium mb-2">Чат не выбран</h3>
          <p className="text-gray-500">Выберите контакт для начала общения</p>
        </div>
      </div>
    );
  }

  // Загрузка сообщений
  if (isMessagesLoading) {
    return <MessageSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col bg-base-100">
      {/* Шапка чата */}
      <div className="border-b border-base-300 p-4 flex items-center gap-3 bg-base-100">
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="h-10 w-10 rounded-full object-cover"
          />
          {selectedUser.online && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-base-100"></div>
          )}
        </div>
        <div>
          <h3 className="font-medium">{selectedUser.fullName}</h3>
          <p className="text-xs text-gray-500">
            {selectedUser.online ? "Онлайн" : `Был(а) в сети ${new Date(selectedUser.lastSeen).toLocaleTimeString()}`}
          </p>
        </div>
      </div>

      {/* Область сообщений */}
      <div 
        className="flex-1 overflow-hidden relative"
        style={{
          backgroundImage: chatBackground ? `url(${chatBackground})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Наложение фона */}
        <div 
          className="absolute inset-0 bg-base-100/80 backdrop-blur-sm"
          style={{ opacity: chatBackground ? chatBackgroundOpacity : 0 }}
        ></div>
        
        {/* Сообщения */}
        <div className="relative h-full overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Нет сообщений. Начните общение!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id || message.createdAt}
                className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={getBubbleStyle(message.senderId === authUser._id)}
                  style={message.senderId === authUser._id && bubbleColor.bg.startsWith('#') ? { 
                    backgroundColor: bubbleColor.bg 
                  } : {}}
                >
                  {message.imageUrl ? (
                    <img 
                      src={message.imageUrl} 
                      alt="Отправленное изображение" 
                      className="max-w-full h-auto rounded-md"
                      loading="lazy"
                    />
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${
                    message.senderId === authUser._id ? "text-white/70" : "text-base-content/70"
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                    {message.status === 'failed' && (
                      <span className="ml-1 flex items-center">
                        <X size={12} className="mr-0.5" /> Не отправлено
                      </span>
                    )}
                    {message.status === 'sending' && (
                      <span className="ml-1 flex items-center">
                        <span className="loading loading-spinner loading-xs mr-0.5"></span> Отправка...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Ошибки */}
      {inputError && (
        <div className="px-4 py-2 bg-error text-error-content text-sm">
          {inputError}
        </div>
      )}

      {/* Поле ввода */}
      <div className="p-4 border-t border-base-300 bg-base-100">
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Превью"
                className="w-20 h-20 object-cover rounded-lg border border-base-300"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-error hover:text-error-content transition-colors"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 input input-bordered rounded-lg bg-base-200/70 focus:bg-base-100 transition-all"
              placeholder="Введите сообщение..."
              disabled={isSending}
            />
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={isSending}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`btn btn-circle ${imagePreview ? "text-emerald-500" : "text-gray-400"} hover:bg-base-300/50 transition-colors`}
              disabled={isSending}
            >
              <Image className="h-5 w-5" />
            </button>
          </div>
          
          <button
            type="submit"
            className="btn btn-circle btn-primary hover:scale-105 transition-transform"
            disabled={isSending || (!text.trim() && !imagePreview)}
          >
            {isSending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;