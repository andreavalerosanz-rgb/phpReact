// Importar las traducciones
import caTranslations from './locales/ca.json';
import esTranslations from './locales/es.json';
import enTranslations from './locales/en.json';

const translations = {
  ca: caTranslations,
  es: esTranslations,
  en: enTranslations
};

class I18n {
  constructor() {
    this.currentLanguage = 'ca';
    this.translations = translations;
    this.listeners = [];
    this.updateCount = 0; 
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found in ${this.currentLanguage}`);
        // Fallback a español si no encuentra en catalán
        if (this.currentLanguage === 'ca') {
          const fallbackValue = this.getFallbackTranslation(key, 'es');
          if (fallbackValue !== key) {
            return fallbackValue;
          }
        }
        return key; // Devuelve la key como último recurso
      }
    }
    
    return value;
  }

  // Fallback a otro idioma
  getFallbackTranslation(key, fallbackLang) {
    const keys = key.split('.');
    let value = this.translations[fallbackLang];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value;
  }

  // Cambiar idioma
  changeLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      this.updateCount++;
      this.notifyListeners();
    }
  }

  // Obtener idioma actual
  getLanguage() {
    return this.currentLanguage;
  }

  // Obtener contador de actualización
  getUpdateCount() {
    return this.updateCount;
  }

  // Idiomas disponibles
  getAvailableLanguages() {
    return [
      { code: 'ca', name: 'Català' },
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'English' }
    ];
  }

  // Suscribirse a cambios de idioma
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notificar a los listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  // Inicializar desde localStorage
  init() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && this.translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }
  }
}

// Crear instancia global
const i18n = new I18n();

// Inicializar
i18n.init();

export default i18n;