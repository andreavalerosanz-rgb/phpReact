import { useState, useEffect } from 'react';
import i18n from '../i18n';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.getLanguage());
  const [updateCount, setUpdateCount] = useState(i18n.getUpdateCount());

  useEffect(() => {
    const unsubscribe = i18n.subscribe((lang) => {
      setCurrentLanguage(lang);
      setUpdateCount(i18n.getUpdateCount());
    });

    return unsubscribe;
  }, []);

  const t = (key) => i18n.t(key);
  const changeLanguage = (lang) => i18n.changeLanguage(lang);
  const getLanguage = () => i18n.getLanguage();
  const getAvailableLanguages = () => i18n.getAvailableLanguages();

  return {
    t,
    currentLanguage,
    changeLanguage,
    getLanguage,
    getAvailableLanguages,
    updateCount
  };
};