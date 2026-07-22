// External library
import { useState } from "react";
import { useTranslation } from "react-i18next"; // 1. Importação do useTranslation

// Components
import useToaster from "@components/feedback/Toaster";
import useValidatorSQLInjection from "@features/shared/hooks/useValidatorSQLInjection";

// Services
import registerUser from "@features/auth/services/register";

// Error
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

// Constants
import { PASSWORD_LENGHT } from "@features/auth/constants/user";

// Types
import type { User } from "@features/auth/types";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";
import errorFactory from "@features/shared/errors/factory/errorFactory";

interface RegisterUser extends User {
  confirmPassword: string;
}

const defaultRegister = {
  username: "",
  name: "",
  email: "",
  affiliation: "",
  country: "",
  password: "",
  confirmPassword: "",
};

const defaultErrors = {
  username: "",
  name: "",
  email: "",
  affiliation: "",
  country: "",
  password: "",
  confirmPassword: "",
};

const useHandleRegister = (redirectFormLogin: () => void) => {
  const { t } = useTranslation("landing/homepage");

  const [createUser, setCreateUser] = useState<RegisterUser>(defaultRegister);
  const [errors, setErrors] =
    useState<Record<keyof RegisterUser, string>>(defaultErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToaster();
  const validator = useValidatorSQLInjection();

  const {
    username,
    name,
    email,
    affiliation,
    country,
    password,
    confirmPassword,
  } = createUser;

  const handleChangeUserInformations = (
    field: keyof RegisterUser,
    value: string
  ) => {
    setCreateUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const validateFields = () => {
    const errors = {
      ...defaultErrors,
    };

    if (!username) {
      errors.username = t("signUp.errors.username");
    }

    if (!name) {
      errors.name = t("signUp.errors.name");
    }

    if (!email) {
      errors.email = t("signUp.errors.email");
    } else if (!validateEmail(email)) {
      errors.email = t("signUp.errors.invalidEmail");
    }

    if (!affiliation) {
      errors.affiliation = t("signUp.errors.affiliation");
    }

    if (!country) {
      errors.country = t("signUp.errors.country");
    }

    if (!password) {
      errors.password = t("signUp.errors.password");
    } else if (
      password.length < PASSWORD_LENGHT.MIN ||
      password.length > PASSWORD_LENGHT.MAX
    ) {
      errors.password = t("signUp.errors.passwordLength", {
        min: PASSWORD_LENGHT.MIN,
        max: PASSWORD_LENGHT.MAX,
      });
    }

    if (!confirmPassword) {
      errors.confirmPassword = t("signUp.errors.confirmPassword");
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t("signUp.errors.passwordMismatch");
    }

    setErrors(errors);
    return Object.values(errors).every((value) => value === "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFields()) return;

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...rest } = createUser;

      if(
        !(
          validator({value: createUser.affiliation}) && 
          validator({value: createUser.confirmPassword}) && 
          validator({value: createUser.country}) && 
          validator({value: createUser.email}) && 
          validator({value: createUser.name}) && 
          validator({value: createUser.password}) && 
          validator({value: createUser.username})
        )
      ) return;
        
      const result = await registerUser(rest);

      if (isLeft(result)) {
        const error = result.value;

        if (error instanceof ApplicationError) {
          if (error.message.includes("username")) {
            setErrors((prev) => ({ ...prev, username: error.message }));
          } else if (error.message.includes("email")) {
            setErrors((prev) => ({ ...prev, email: error.message }));
          } else {
            toast({
              title: t("signUp.toast.errorTitle"),
              status: "error",
              description: error.message,
            });
          }
        } else {
          toast({
            title: t("signUp.toast.unexpectedErrorTitle"),
            status: "error",
            description: t("signUp.toast.unexpectedErrorDesc"),
          });
        }
        return;
      }

      toast({
        title: t("signUp.toast.successTitle"),
        status: "success",
        description: t("signUp.toast.successDesc", { username: result.value.username }),
      });
      redirectFormLogin();
    } catch (error) {
      const appError = errorFactory("custom", (error as Error).message);
      toast({
        title: t("signUp.toast.unexpectedErrorTitle"),
        status: "error",
        description: appError.value.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createUser,
    errors,
    isSubmitting,
    handleChangeUserInformations,
    handleRegister: handleSubmit,
  };
};

export default useHandleRegister;