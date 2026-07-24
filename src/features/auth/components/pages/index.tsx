  import useToaster from "@components/feedback/Toaster";
  import confirmAccount from "@features/auth/services/confirmAccount";
  import { isLeft } from "@features/shared/errors/pattern/Either";
  import { useEffect } from "react";
  import { useNavigate, useSearchParams } from "react-router-dom";
	import { useTranslation } from "react-i18next";

  export default function ConfirmAccount() {
    const [searchParams] = useSearchParams();

    const Toaster = useToaster();
    const navigate = useNavigate();
    const { t } = useTranslation("landing/email-pages");

    useEffect(() => {
      const tokenParam = searchParams.get("id")?.trim();

      if (!tokenParam || tokenParam === "") {
        Toaster({
					title: t("emailConfirmation.toast.emptyTokenTitle"),
					description: t("emailConfirmation.toast.emptyTokenDesc"),
					status: "error",
				});

        setTimeout(() => {
          navigate("/");
        }, 3000);

        return;
      }

      const handleConfirm = async (token: string) => {
        const result = await confirmAccount({token: token})

        if (isLeft(result)) {
          const errorMessage = result.value.message;
					Toaster({
						title: t("emailConfirmation.toast.invalidTokenTitle"),
						description: errorMessage,
						status: "error",
					});
        } else{
					Toaster({
						title: t("emailConfirmation.toast.successTitle"),
						description: t("emailConfirmation.toast.successDesc"),
						status: "success",
					});
        }

        setTimeout(() => {
          navigate("/");
        }, 4000);
      }

      handleConfirm(tokenParam)   
    }, [searchParams, navigate, Toaster, t]);


  return <p>{t("emailConfirmation.loading")}</p>;
  }
