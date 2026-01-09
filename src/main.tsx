// External library
import React from "react";
import ReactDOM from "react-dom/client";

// Contexts
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "./features/shared/context/ApplicationContext";
import { StudySelectionProvider } from "@features/review/shared/context/StudiesSelectionContext.tsx";
import { StudyExtractionProvider } from "@features/review/shared/context/StudiesExtractionContext.tsx";

// Components
import App from "./App.tsx";

// Styles
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <AppProvider>
        <StudySelectionProvider>
          <StudyExtractionProvider>
            <App />
          </StudyExtractionProvider>
        </StudySelectionProvider>
      </AppProvider>
    </ChakraProvider>
  </React.StrictMode>
);
