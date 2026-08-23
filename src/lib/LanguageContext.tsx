import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'en' | 'tl';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    localStorage.getItem('app-language') === 'tl' ? 'tl' : 'en',
  );

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    localStorage.setItem('app-language', next);
  };

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
