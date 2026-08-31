import { createContext, useContext, useState, ReactNode } from "react";

type ExportContextType = {
  isExporting: boolean;
  startExport: () => void;
  endExport: () => void;
};

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export const ExportProvider = ({ children }: { children: ReactNode }) => {
  const [isExporting, setIsExporting] = useState(false);

  const startExport = () => setIsExporting(true);
  const endExport = () => setIsExporting(false);

  return (
    <ExportContext.Provider value={{ isExporting, startExport, endExport }}>
      {children}
    </ExportContext.Provider>
  );
};

export const useExport = () => {
  const context = useContext(ExportContext);
  if (!context) throw new Error("useExport must be used within ExportProvider");
  return context;
};
