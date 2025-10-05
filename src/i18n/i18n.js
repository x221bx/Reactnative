import React, { createContext, useContext, useMemo, useState } from 'react';
import en from './langs/en.json';
import ar from './langs/ar.json';

const dict = { en, ar };
const I18nContext = createContext(null);

export function I18nProvider({ children, defaultLang = 'en' }) {
  const [lang, setLang] = useState(defaultLang);
  const t = (key) => (dict[lang] && dict[lang][key]) || key;
  const value = useMemo(() => ({ lang, setLang, t }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}

