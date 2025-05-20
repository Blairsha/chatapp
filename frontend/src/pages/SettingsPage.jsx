import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguageStore } from "../store/useLanguageStore";
import { Sun, Star, Lock, Languages, Check } from "lucide-react";
import AppearanceSettings from "./settings/AppearanceSettings";
import FavoritesSettings from "./settings/FavoritesSettings";
import PrivacySettings from "./settings/PrivacySettings";
import LanguageSettings from "./settings/LanguageSettings";

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    location.pathname.split('/').pop() || 'appearance'
  );

  const tabs = [
    { id: 'favorites', name: 'Избранное', icon: <Star size={18} /> },
    { id: 'appearance', name: 'Оформление', icon: <Sun size={18} /> },
    { id: 'privacy', name: 'Конфиденциальность', icon: <Lock size={18} /> },
    { id: 'language', name: 'Язык', icon: <Languages size={18} /> },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/settings/${tabId}`);
  };

  return (
    <div className="container mx-auto px-4 pt-32 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Настройки</h1>
        <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
          Управление параметрами вашего аккаунта
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Боковая панель с вкладками */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-base-100 rounded-2xl p-2 shadow-lg border border-base-200 sticky top-32">
            <ul className="menu">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-3 ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Контент выбранной вкладки */}
        <div className="flex-1">
          {activeTab === 'favorites' && <FavoritesSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'privacy' && <PrivacySettings />}
          {activeTab === 'language' && <LanguageSettings />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;