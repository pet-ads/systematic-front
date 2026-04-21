import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enHomepage from "../locales/en/landing/homepage.json";
import ptHomepage from "../locales/pt/landing/homepage.json";
import enProfile from "../locales/en/user/profile.json";
import ptProfile from "../locales/pt/user/profile.json";
import enSidebar from "../locales/en/structure/sidebar.json";
import ptSidebar from "../locales/pt/structure/sidebar.json";
import enMyReviews from "../locales/en/user/my-reviews.json";
import ptMyReviews from "../locales/pt/user/my-reviews.json";
import enPlanningProtocol from "../locales/en/review/planning-protocol.json";
import ptPlanningProtocol from "../locales/pt/review/planning-protocol.json";
import enExecutionIdentification from "../locales/en/review/execution-identification.json"
import ptExecutionIdentification from "../locales/pt/review/execution-identification.json"
import enExecutionSelection from "../locales/en/review/execution-selection.json"
import ptExecutionSelection from "../locales/pt/review/execution-selection.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,

    resources: {
      en: {
        "landing/homepage": enHomepage,
        "user/my-reviews": enMyReviews,
        "user/profile": enProfile,
        "structure/sidebar": enSidebar,
        "review/planning-protocol": enPlanningProtocol,
        "review/execution-identification": enExecutionIdentification,
        "review/execution-selection": enExecutionSelection,
      },
      pt: {
        "landing/homepage": ptHomepage,
        "user/my-reviews": ptMyReviews,
        "user/profile": ptProfile,
        "structure/sidebar": ptSidebar,
        "review/planning-protocol": ptPlanningProtocol,
        "review/execution-identification": ptExecutionIdentification,
        "review/execution-selection": ptExecutionSelection,
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;