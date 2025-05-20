// LanguageSettings.jsx
import { useLanguageStore } from "../../store/useLanguageStore";
import { Check } from "lucide-react";

const LanguageSettings = () => {
  const { language, setLanguage } = useLanguageStore();

  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
  ];

  return (
    <div className="bg-base-100 rounded-2xl p-8 shadow-lg border border-base-200">
      <h2 className="text-2xl font-semibold mb-4">Язык</h2>
      <div className="h-1 w-12 bg-primary rounded-full mb-6"></div>
      <p className="text-base-content/70 mb-8">Выберите предпочитаемый язык интерфейса</p>

      <div className="space-y-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between w-full p-4 rounded-lg transition-all ${
              language === lang.code
                ? 'bg-primary/10 border-primary border-2'
                : 'bg-base-200 hover:bg-base-300 border-transparent border-2'
            }`}
          >
            <span className="font-medium">{lang.name}</span>
            {language === lang.code && <Check className="text-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSettings;