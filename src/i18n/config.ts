import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enHomepage from "../locales/en/landing/homepage.json";
import ptHomepage from "../locales/pt/landing/homepage.json";
import enProfile from "../locales/en/user/profile.json";
import ptProfile from "../locales/pt/user/profile.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,

    resources: {
      en: {
        "landing/homepage": enHomepage,
        "user/profile": enProfile,
      },
      pt: {
        "landing/homepage": ptHomepage,
        "user/profile": ptProfile,
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;