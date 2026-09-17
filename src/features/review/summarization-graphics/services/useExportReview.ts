import { useState } from "react";
import JSZip from "jszip";
import Axios from "../../../../infrastructure/http/axiosClient";
import { ConductionExportConfig, ExportItemConfig } from "./exportReviewTypes";
import { ChartExportHandle } from "../components/charts/FunnelChart";

type ChartRefMap = Record<string, React.RefObject<ChartExportHandle | null>>;

function waitForRef(
  ref: React.RefObject<ChartExportHandle | null> | undefined,
  timeoutMs = 5000,
  intervalMs = 100
): Promise<ChartExportHandle | null> {
  return new Promise((resolve) => {
    if (!ref) {
      resolve(null);
      return;
    }
    const start = Date.now();
    const check = () => {
      if (ref.current) {
        resolve(ref.current);
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        resolve(null);
        return;
      }
      setTimeout(check, intervalMs);
    };
    check();
  });
}

export const useExportReview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const systematicStudyId = localStorage.getItem("systematicReviewId");

  const exportReview = async (
    conduction: ConductionExportConfig,
    exportItems: ExportItemConfig[],
    chartRefs: ChartRefMap
  ) => {
    if (!systematicStudyId) {
      setError("ID da revisão não encontrado");
      throw new Error("ID da revisão não encontrado");
    }
    setIsLoading(true);
    setError(null);
    const failedImages: string[] = [];

    try {
      const path = `systematic-study/${systematicStudyId}/report/exportable-review/latex?downloadable=true`;
      const response = await Axios.post(path, { conduction, exportItems }, { responseType: "text" });
      const texContent: string = response.data;

      const zip = new JSZip();
      zip.file(`review_${systematicStudyId}.tex`, texContent);

      // Único item que ainda vira imagem é o funil — pizza/barra/bolha agora
      // são desenhados nativamente em pgfplots dentro do próprio .tex pelo back.
      if (conduction.funnel) {
        try {
          const handle = await waitForRef(chartRefs["funnel"]);
          if (handle) {
            zip.file("StudiesFunnel.png", await handle.exportAsImage());
          } else {
            failedImages.push("Funil de estudos");
          }
        } catch (e) {
          console.error("Falha ao exportar funil:", e);
          failedImages.push("Funil de estudos");
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `review_${systematicStudyId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      if (failedImages.length > 0) {
        setError(`Algumas imagens não puderam ser geradas: ${failedImages.join(", ")}`);
      }
    } catch (err: any) {
      console.error("Erro ao exportar revisão:", err);
      setError("Erro ao exportar revisão");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { exportReview, isLoading, error };
};