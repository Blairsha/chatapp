import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "../../store/useThemeStore";
import { Sun, Moon, Check, X, Send, Palette, MessageSquare, Image, Paintbrush } from "lucide-react";
import toast from "react-hot-toast";
import { HexColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Привет! Как твои дела?", isSent: false },
  { id: 2, content: "Всё отлично! Только что закончил новый проект.", isSent: true },
  { id: 3, content: "Как продвигается работа над настройками интерфейса?", isSent: false },
  { id: 4, content: "Почти готово! Осталось только выбрать цвет сообщений.", isSent: true },
];

const THEMES = [
  { id: 'light', name: 'Светлая', icon: Sun, bg: 'bg-amber-100', text: 'text-amber-600' },
  { id: 'dark', name: 'Темная', icon: Moon, bg: 'bg-indigo-900', text: 'text-indigo-200' },
];

const MESSAGE_THEMES = [
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

const DEFAULT_COLORS = [
  { name: "Основной", bg: "bg-primary", text: "text-white" },
  { name: "Голубой", bg: "bg-blue-500", text: "text-white" },
  { name: "Изумрудный", bg: "bg-emerald-500", text: "text-white" },
  { name: "Розовый", bg: "bg-rose-500", text: "text-white" },
  { name: "Фиолетовый", bg: "bg-purple-500", text: "text-white" },
];

const MessageBubble = ({ message, bubbleColor, messageTheme }) => {
  const currentTheme = MESSAGE_THEMES.find(t => t.id === messageTheme) || MESSAGE_THEMES[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
    >
      <div 
        className={`max-w-[80%] p-3 shadow-sm transition-all duration-200 ${
          message.isSent 
            ? currentTheme.sentClass 
            : currentTheme.receivedClass
        } ${
          message.isSent
            ? bubbleColor.bg.startsWith('#')
              ? "text-white"
              : `${bubbleColor.bg} text-white`
            : "bg-base-200 text-base-content"
        }`}
        style={message.isSent && bubbleColor.bg.startsWith('#') ? { 
          backgroundColor: bubbleColor.bg 
        } : {}}
      >
        <p className="text-sm">{message.content}</p>
        <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${
          message.isSent ? "text-white/70" : "text-base-content/70"
        }`}>
          <span>12:0{message.id}</span>
          {message.isSent && <Check size={12} className="ml-1" />}
        </div>
      </div>
    </motion.div>
  );
};

const AppearanceSettings = () => {
  const { 
    theme, 
    setTheme,
    chatBackground, 
    setChatBackground,
    chatBackgroundOpacity,
    setChatBackgroundOpacity,
    messageTheme,
    setMessageTheme,
    bubbleColor,
    setBubbleColor
  } = useThemeStore();
  
  const fileInputRef = useRef(null);
  const chatPreviewRef = useRef(null);
  const [showBubbleColorPicker, setShowBubbleColorPicker] = useState(false);
  const [tempBubbleColor, setTempBubbleColor] = useState(bubbleColor.bg);

  useEffect(() => {
    if (chatPreviewRef.current) {
      chatPreviewRef.current.scrollTop = chatPreviewRef.current.scrollHeight;
    }
  }, [bubbleColor, messageTheme]);

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      toast.error('Допустимые форматы: JPEG, PNG, WEBP');
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error('Максимальный размер файла - 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setChatBackground(reader.result);
    reader.readAsDataURL(file);
  };

  const getBubbleStyle = (isSent) => {
    const currentTheme = MESSAGE_THEMES.find(t => t.id === messageTheme) || MESSAGE_THEMES[0];
    const base = "max-w-[80%] p-3 shadow-sm transition-all duration-200";
    
    if (isSent) {
      return `${base} ${currentTheme.sentClass} ${
        bubbleColor.bg.startsWith('#') 
          ? "text-white" 
          : `${bubbleColor.bg} text-white`
      }`;
    }
    
    return `${base} ${currentTheme.receivedClass} bg-base-200 text-base-content`;
  };

  const handleSaveBubbleColor = () => {
    setBubbleColor({ 
      bg: tempBubbleColor.startsWith('#') ? tempBubbleColor : `#${tempBubbleColor}`,
      text: "text-white"
    });
    setShowBubbleColorPicker(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* 1. Секция выбора темы */}
      <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Paintbrush size={20} />
            Цветовая тема
          </h2>
          <p className="text-sm text-base-content/70">Выберите основную цветовую схему интерфейса</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {THEMES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative p-4 rounded-xl border transition-all ${
                  theme === t.id 
                    ? 'border-primary bg-primary/5 shadow-inner' 
                    : 'border-base-300 hover:bg-base-200/30'
                }`}
              >
                {theme === t.id && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1 text-white">
                    <Check size={14} />
                  </div>
                )}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full mx-auto mb-3 ${t.bg} ${t.text}`}>
                  <Icon size={20} />
                </div>
                <p className="text-center font-medium text-sm">{t.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Секция стиля сообщений */}
      <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <MessageSquare size={20} />
            Стиль сообщений
          </h2>
          <p className="text-sm text-base-content/70">
            Настройте внешний вид сообщений в чате
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold mb-3">Форма сообщений</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MESSAGE_THEMES.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => setMessageTheme(t.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border transition-all ${
                  messageTheme === t.id 
                    ? 'border-primary bg-primary/5 shadow-inner' 
                    : 'border-base-300 hover:bg-base-200/30'
                }`}
              >
                <div className="flex flex-col items-center">
                  <motion.div 
                    className={getBubbleStyle(true).replace('max-w-[80%]', 'w-full')}
                    style={bubbleColor.bg.startsWith('#') ? { 
                      backgroundColor: bubbleColor.bg 
                    } : {}}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs text-center">Пример</p>
                  </motion.div>
                  <p className="mt-2 text-center text-sm font-medium">{t.name}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-md font-semibold mb-3">Цвет ваших сообщений</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {DEFAULT_COLORS.map((color) => (
              <motion.button
                key={color.name}
                onClick={() => {
                  setBubbleColor(color);
                  setTempBubbleColor(color.bg.replace('bg-', '').replace('-500', ''));
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                  bubbleColor.bg === color.bg 
                    ? 'border-primary bg-primary/5' 
                    : 'border-transparent hover:border-base-300'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full ${color.bg} shadow-inner`}
                ></div>
                <span className="text-sm font-medium">{color.name}</span>
              </motion.button>
            ))}
          </div>
          
          <div className="mt-4 flex flex-col items-center">
            <motion.button 
              onClick={() => {
                setShowBubbleColorPicker(!showBubbleColorPicker);
                setTempBubbleColor(bubbleColor.bg.startsWith('#') ? bubbleColor.bg.replace('#', '') : bubbleColor.bg.replace('bg-', '').replace('-500', ''));
              }}
              className="btn btn-outline btn-sm mb-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Другой цвет
            </motion.button>
            
            <AnimatePresence>
              {showBubbleColorPicker && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full overflow-hidden"
                >
                  <div className="w-full p-4 bg-base-100 rounded-xl shadow-lg border border-base-300 flex flex-col items-center">
                    <div 
                      className="w-full h-12 mb-4 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: `#${tempBubbleColor}` }}
                    >
                      Выбранный цвет: #{tempBubbleColor}
                    </div>
                    <HexColorPicker 
                      color={`#${tempBubbleColor}`} 
                      onChange={(color) => setTempBubbleColor(color.replace('#', ''))} 
                      className="!w-full !h-64 mx-auto"
                    />
                    <div className="flex justify-between mt-4">
                      <button 
                        onClick={() => setShowBubbleColorPicker(false)}
                        className="btn btn-ghost btn-sm"
                      >
                        Отмена
                      </button>
                      <button 
                        onClick={handleSaveBubbleColor}
                        className="btn btn-primary btn-sm"
                      >
                        Сохранить
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. Превью чата */}
      <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <MessageSquare size={20} />
            Предпросмотр чата
          </h2>
          <p className="text-sm text-base-content/70">
            Посмотрите, как будут выглядеть ваши сообщения с выбранными настройками
          </p>
        </div>

        <div className="max-w-sm mx-auto bg-base-100 rounded-lg shadow-sm overflow-hidden border border-base-200">
          {/* Шапка чата */}
          <div className="px-4 py-3 border-b border-base-200 bg-base-100 flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                <span>П</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Полина</h3>
              <p className="text-xs opacity-80">В сети</p>
            </div>
          </div>

          {/* Область сообщений */}
          <div 
            ref={chatPreviewRef}
            className="relative min-h-[280px] max-h-[280px] overflow-y-auto p-3"
            style={{
              backgroundImage: chatBackground ? `url(${chatBackground})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div 
              className="absolute inset-0 bg-base-100/80 backdrop-blur-sm"
              style={{
                opacity: chatBackground ? chatBackgroundOpacity : 0,
              }}
            ></div>
            
            <div className="relative space-y-2">
              <AnimatePresence>
                {PREVIEW_MESSAGES.map((message) => (
                  <MessageBubble 
                    key={message.id}
                    message={message}
                    bubbleColor={bubbleColor}
                    messageTheme={messageTheme}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Поле ввода с иконками */}
          <div className="p-3 border-t border-base-200 bg-base-100">
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-sm input-bordered flex-1 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-base-200/70 focus:bg-base-100"
                placeholder="Напишите сообщение..."
                value="Type a message..."
                readOnly
              />
              <button className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:text-gray-700">
                <Image size={16} />
              </button>
              <button className="btn btn-sm btn-primary px-3 gap-1 shadow-sm">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;