// External library
import { useState } from "react";

// Components
import useToaster from "@components/feedback/Toaster";
import useValidatorSQLInjection from "@features/shared/hooks/useValidatorSQLInjection";

// Services
import registerUser from "@features/auth/services/register";

// Error
import { ApplicationError } from "@features/shared/errors/base/ApplicationError";

// Constants
import { PASSWORD_LENGHT } from "@features/auth/constants/user";

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

// Types
import type { User } from "@features/auth/types";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";
import errorFactory from "@features/shared/errors/factory/errorFactory";

interface RegisterUser extends User {
  confirmPassword: string;
}

const useHandleRegister = (redirectFormLogin: () => void) => {
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
      errors.username = "Please, enter your username";
    }

    if (!name) {
      errors.name = "Please, enter your full name";
    }

    if (!email) {
      errors.email = "Please, enter your email";
    } else if (!validateEmail(email)) {
      errors.email = "Invalid email address format";
    }

    if (!affiliation) {
      errors.affiliation = "Please, enter your affiliation";
    }

    if (!country) {
      errors.country = "Please, enter your country";
    }

    if (!password) {
      errors.password = "Please, enter your password";
    } else if (
      password.length < PASSWORD_LENGHT.MIN ||
      password.length > PASSWORD_LENGHT.MAX
    ) {
      errors.password = `Password must be at least ${PASSWORD_LENGHT.MIN} characters and at most ${PASSWORD_LENGHT.MAX} characters`;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please, confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

      if(!(validator({value: createUser.affiliation}) && validator({value: createUser.confirmPassword}) && validator({value: createUser.country}) && validator({value: createUser.email}) && validator({value: createUser.name}) && validator({value: createUser.password}) && validator({value: createUser.username}))) return;
        
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
              title: "Error",
              status: "error",
              description: error.message,
            });
          }
        } else {
          toast({
            title: "Unexpected Error",
            status: "error",
            description: "An unknown error format was received.",
          });
        }
        return;
      }

      toast({
        title: "Account created",
        status: "success",
        description: `You can now log in with your account, ${result.value.username}.`,
      });
      redirectFormLogin();
    } catch (error) {
      const appError = errorFactory("custom", (error as Error).message);
      toast({
        title: "Unexpected error",
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
