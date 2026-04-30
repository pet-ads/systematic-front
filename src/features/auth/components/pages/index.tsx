  import useToaster from "@components/feedback/Toaster";
  import confirmAccount from "@features/auth/services/confirmAccount";
  import { isLeft } from "@features/shared/errors/pattern/Either";
  import { useEffect } from "react";
  import { useNavigate, useSearchParams } from "react-router-dom";

  export default function ConfirmAccount() {
    const [searchParams] = useSearchParams();

    const Toaster = useToaster();
    const navigate = useNavigate();

    useEffect(() => {
      const tokenParam = searchParams.get("id")?.trim();

      if (!tokenParam || tokenParam === "") {
        Toaster({
          title: "Empty token!",
          description: "Back to main page in 3 seconds..",
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
            title: "Token invalid!",
            description: errorMessage,
            status: "error",
          });
        } else{
          Toaster({
            title: "Success!",
            description: "Account confirmed! You can login now",
            status: "success",
          });
        }


        setTimeout(() => {
          navigate("/");
        }, 4000);
      }

      handleConfirm(tokenParam)   
    }, [searchParams, navigate, Toaster]);



  return <p>Confirmando sua conta...</p>;
  }
