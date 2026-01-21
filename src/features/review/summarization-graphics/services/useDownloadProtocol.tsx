import { useState } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";

export type DownloadProtocolFormat = "latex" 

export const useDownloadProtocol = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const systematicStudyId = localStorage.getItem("systematicReviewId");

  const downloadProtocol = async (format: DownloadProtocolFormat) => {
    if (!systematicStudyId) {
      setError("ID da revisão não encontrado");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
     
      const path = `systematic-study/${systematicStudyId}/report/exportable-protocol/${format}?downloadable=true`;

      const response = await Axios.get(path, {
        responseType: "blob", 
      });

      const mimeType = format === "latex" ? "application/x-tex" : "text/csv";
      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `protocol_${systematicStudyId}.${format === "latex" ? "tex" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Erro ao gerar protocolo:", err);
      setError("Erro ao gerar protocolo");
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadProtocol, isLoading, error };
};
