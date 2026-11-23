import { useCallback, useEffect, useState } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";
import useToaster from "@components/feedback/Toaster";
import { useTranslation } from "react-i18next";

export default function useAssignStudies() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAssignmentAvailable, setIsAssignmentAvailable] = useState<boolean>(false);
  const toast = useToaster();
  const { t } = useTranslation("review/execution-identification");

  const checkStudiesAvailability = useCallback(
    async (stage: "SELECTION" | "EXTRACTION" = "SELECTION"): Promise<boolean> => {
      setIsCheckingAvailability(true);
      try {
        const id = localStorage.getItem("systematicReviewId");
        if (!id) return false;

        const url = `systematic-study/${id}/review-mode/assign-studies/available`;
        const response = await Axios.get(url, { params: { stage } });
        const data = response.data;

        const isAvailable =
          typeof data === "boolean"
            ? data
            : typeof data?.available === "boolean"
            ? data.available
            : typeof data?.hasAvailableStudies === "boolean"
            ? data.hasAvailableStudies
            : Boolean(data?.data ?? data);

        setIsAssignmentAvailable(isAvailable);
        return isAvailable;
      } catch (error) {
        console.error("Erro ao verificar disponibilidade de estudos:", error);
        setIsAssignmentAvailable(false);
        return false;
      } finally {
        setIsCheckingAvailability(false);
      }
    },
    []
  );

  useEffect(() => {
    checkStudiesAvailability();
  }, [checkStudiesAvailability]);

  const assignStudies = async (
    onSuccess?: () => void,
    stage: "SELECTION" | "EXTRACTION" = "SELECTION"
  ) => {
    setIsLoading(true);
    try {
      const id = localStorage.getItem("systematicReviewId");
      const url = `systematic-study/${id}/review-mode/assign-studies`;

      await Axios.post(url, { stage });

      setIsAssignmentAvailable(false);

      if (onSuccess) {
        onSuccess();
      }

      toast({
        title: t("buttonForStudiesAssignment.toasts.success.title"),
        description: t("buttonForStudiesAssignment.toasts.success.description"),
        status: "success",
      });
    } catch (error) {
      toast({
        title: t("buttonForStudiesAssignment.toasts.error.title"),
        description: t("buttonForStudiesAssignment.toasts.error.description"),
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assignStudies,
    isLoading,
    isAssignmentAvailable,
    setIsAssignmentAvailable,
    checkStudiesAvailability,
    isCheckingAvailability,
  };
}
