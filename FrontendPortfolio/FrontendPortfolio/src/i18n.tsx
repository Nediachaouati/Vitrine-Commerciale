import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import themeConfig from './theme.config';
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: themeConfig.locale || 'en',
    debug: false,
    load: 'languageOnly',
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;

// i18n
//   .use(Backend)
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     fallbackLng: themeConfig.locale || 'en',
//     debug: false,
//     load: 'languageOnly',
//     backend: {
//       loadPath: import.meta.env.BASE_URL + 'locales/{{lng}}/translation.json',
//     },
//   });

// export default i18n;
