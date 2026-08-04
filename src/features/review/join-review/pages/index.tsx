import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useToaster from "@components/feedback/Toaster";
import { isLeft } from "@features/shared/errors/pattern/Either";
import respondInvitation from "../services/respondInvitation";

export default function JoinReview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToaster();
  const { t } = useTranslation("landing/email-pages");

  useEffect(() => {
    const token = searchParams.get("token")?.trim();

    if (!token) {
      toast({
        title: t("joinReview.toast.emptyTokenTitle"),
        description: t("joinReview.toast.emptyTokenDesc"),
        status: "error",
      });
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    const handleAccept = async () => {
      const result = await respondInvitation({
        token,
        inviteResponse: "ACCEPTED",
      });

      if (isLeft(result)) {
        toast({
          title: t("joinReview.toast.errorTitle"),
          description: t("joinReview.toast.errorDesc"),
          status: "error",
        });
      } else {
        toast({
          title: t("joinReview.toast.successTitle"),
          description: t("joinReview.toast.successDesc"),
          status: "success",
        });
      }

      setTimeout(() => navigate("/home"), 3000);
    };

    handleAccept();
  }, [searchParams, navigate, toast, t]);

  return <p>{t("joinReview.loading")}</p>;
}