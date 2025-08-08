// External library
import React from "react";
import ReactDOM from "react-dom/client";

// Contexts
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "./features/shared/context/ApplicationContext";
import { StudySelectionProvider } from "@features/review/shared/context/StudiesSelectionContext.tsx";
import { AuthProvider } from "@features/auth/context/AuthContext.tsx";

// Components
import App from "./App.tsx";

// Styles
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <AppProvider>
          <StudySelectionProvider>
            <App />
          </StudySelectionProvider>
        </AppProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
