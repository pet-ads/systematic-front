import { useState } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";
import useToaster from "@components/feedback/Toaster";
import { useTranslation } from "react-i18next";

export default function useAssignStudies() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToaster();
  const { t } = useTranslation("review/execution-identification");

  const assignStudies = async (onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      const id = localStorage.getItem("systematicReviewId");
      const url = `systematic-study/${id}/study-review/assign`;

      await Axios.post(url);

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

  return { assignStudies, isLoading };
}
