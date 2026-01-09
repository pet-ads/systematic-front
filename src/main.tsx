// External library
import React from "react";
import ReactDOM from "react-dom/client";

// Contexts
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "./features/shared/context/ApplicationContext";
import { StudyProvider } from "@features/review/shared/context/StudiesContext.tsx";

// Components
import App from "./App.tsx";

// Styles
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <AppProvider>
        <StudyProvider>
            <App />
        </StudyProvider>
      </AppProvider>
    </ChakraProvider>
  </React.StrictMode>
);
