import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enHomepage from "../locales/en/landing/homepage.json";
import ptHomepage from "../locales/pt/landing/homepage.json";
import enProfile from "../locales/en/user/profile.json";
import ptProfile from "../locales/pt/user/profile.json";
import enSidebar from "../locales/en/structure/sidebar.json";
import ptSidebar from "../locales/pt/structure/sidebar.json";

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
        "structure/sidebar": enSidebar
      },
      pt: {
        "landing/homepage": ptHomepage,
        "user/profile": ptProfile,
        "structure/sidebar": ptSidebar
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;