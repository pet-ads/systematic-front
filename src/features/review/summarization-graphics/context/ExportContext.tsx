import { createContext, useContext, useState, ReactNode } from "react";

export type DownloadConfig = {
  selector: string;
  fileName: string;
  onDownloadCsv: () => void;
};

type ExportContextType = {
  isExporting: boolean;
  startExport: () => void;
  endExport: () => void;
  downloadConfig?: DownloadConfig;
  setDownloadConfig: (config?: DownloadConfig) => void;
};

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export const ExportProvider = ({ children }: { children: ReactNode }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadConfig, setDownloadConfig] = useState<DownloadConfig | undefined>(undefined);

  const startExport = () => setIsExporting(true);
  const endExport = () => setIsExporting(false);

  return (
    <ExportContext.Provider
      value={{
        isExporting,
        startExport,
        endExport,
        downloadConfig,
        setDownloadConfig,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
};

export const useExport = () => {
  const context = useContext(ExportContext);
  if (!context) throw new Error("useExport must be used within ExportProvider");
  return context;
};

