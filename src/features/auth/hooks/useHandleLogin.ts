// External library
import { useState } from "react";

// Hooks
import { useAuth } from "@features/auth/hooks/useAuth";
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Constants
const MINIMAL_PASSWORD_LENGHT = 5;

// Types
import type { AccessCredentials } from "@features/auth/types";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";

export default function useHandleLogin() {
  const [credentials, setCredentials] = useState<AccessCredentials>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toGo } = useNavigation();

  const handleChangeCredentials = (
    field: keyof typeof credentials,
    value: string
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateFields = () => {
    const errors = {
      username: "",
      password: "",
    };

    if (!credentials.username) {
      errors.username = "Please, enter your username";
    }

    if (!credentials.password) {
      errors.password = "Please, enter your password";
    }

    if (credentials.password.length < MINIMAL_PASSWORD_LENGHT) {
      errors.password = `Password must have at least ${MINIMAL_PASSWORD_LENGHT} characters`;
    }

    setErrors((prev) => ({ ...prev, ...errors }));
    return errors.username === "" && errors.password === "";
  };

  const result = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFields()) return;

    setIsSubmitting(true);
    try {
      if (isLeft(result)) return;

      const { login } = result.value;

      await login(credentials);
      toGo("/user");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Wrong username or password",
      }));
    } finally {
      setErrors({
        username: "",
        password: "",
        general: "",
      });
      setIsSubmitting(false);
    }
  };

  return {
    credentials,
    errors,
    isSubmitting,
    handleChangeCredentials,
    handleSubmit,
  };
}
