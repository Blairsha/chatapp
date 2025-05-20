import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const MESSAGE_THEMES = [
  { 
    id: 'default', 
    name: 'Стандартная',
    sentClass: "rounded-2xl rounded-br-none",
    receivedClass: "rounded-2xl rounded-bl-none"
  },
  { 
    id: 'rounded', 
    name: 'Закругленная',
    sentClass: "rounded-full rounded-br-none",
    receivedClass: "rounded-full rounded-bl-none"
  },
  { 
    id: 'bordered', 
    name: 'С рамкой',
    sentClass: "rounded-2xl rounded-br-none border-2 border-primary/30",
    receivedClass: "rounded-2xl rounded-bl-none border-2 border-base-300"
  },
  { 
    id: 'minimal', 
    name: 'Минимализм',
    sentClass: "rounded-none",
    receivedClass: "rounded-none"
  },
  { 
    id: 'neumorphic', 
    name: 'Неоморфизм',
    sentClass: "rounded-2xl shadow-neu-sm",
    receivedClass: "rounded-2xl shadow-neu-sm"
  }
];

export const DEFAULT_COLORS = [
  { name: "Основной", bg: "bg-primary", text: "text-white" },
  { name: "Голубой", bg: "bg-blue-500", text: "text-white" },
  { name: "Изумрудный", bg: "bg-emerald-500", text: "text-white" },
  { name: "Розовый", bg: "bg-rose-500", text: "text-white" },
  { name: "Фиолетовый", bg: "bg-purple-500", text: "text-white" },
];

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      chatBackground: null,
      chatBackgroundOpacity: 0.85,
      messageTheme: 'default',
      bubbleColor: DEFAULT_COLORS[0],
      
      setTheme: (theme) => set({ theme }),
      setChatBackground: (background) => set({ chatBackground: background }),
      setChatBackgroundOpacity: (opacity) => set({ chatBackgroundOpacity: opacity }),
      setMessageTheme: (theme) => set({ messageTheme: theme }),
      setBubbleColor: (color) => set({ bubbleColor: color }),
      clearChatBackground: () => set({ chatBackground: null }),
    }),
    {
      name: 'theme-storage',
      getStorage: () => localStorage,
    }
  )
);