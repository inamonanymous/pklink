import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi) // Load translations via HTTP (for JSON files)
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // Initialize react-i18next
  .init({
    supportedLngs: ['en', 'fil'], // Define supported languages
    fallbackLng: 'en', // Default language
    debug: true,
    detection: {
      order: ['localStorage', 'navigator'], // Language detection order
      caches: ['localStorage'], // Save the selected language
    },
    backend: {
      loadPath: '/locales/{{lng}}.json', // Path to translation files
    },
  });

export default i18n;
