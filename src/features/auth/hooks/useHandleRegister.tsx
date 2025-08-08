// External library
import { useState } from "react";

// Services
import useRegisterUser from "../services/useRegisterUser";

// Types
import type { User } from "../types";
import useToaster from "@components/feedback/Toaster";

const useHandleRegister = (redirectFormLogin: () => void) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [affiliation, setAffiliation] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [affiliationError, setAffiliationError] = useState<string>("");
  const [stateError, setStateError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  let toast = useToaster();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handleAffiliationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAffiliation(e.target.value);
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setState(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setConfirmPassword(e.target.value);

  const passwordMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;

    if (!name) {
      setNameError("Please enter your name");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError("Please enter your email");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email address format");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!affiliation) {
      setAffiliationError("Please enter your affiliation");
      isValid = false;
    } else {
      setAffiliationError("");
    }

    if (!state) {
      setStateError("Please select your state");
      isValid = false;
    } else {
      setStateError("");
    }

    if (!password) {
      setPasswordError("Please, enter your password");
      setConfirmPasswordError("Please, enter your password");
      isValid = false;
    } else if (!confirmPassword) {
      setPasswordError("Please, enter your confirm password");
      setConfirmPasswordError("Please, enter your confirm password");
      isValid = false;
    } else if (password.length < 5) {
      setPasswordError("Password must be at least 5 characters long");
      setConfirmPasswordError("Password must be at least 5 characters long");
      isValid = false;
    } else if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setPasswordError("");
      setConfirmPasswordError("");
    }

    if (isValid) {
      setIsSubmitting(true);
      const data: User = {
        username: name,
        password: password,
        email: email,
        country: state,
        affiliation: affiliation,
      };

      try {
        const response = await useRegisterUser(data);
        const user = response.data.username;
        sessionStorage.setItem("userId", response.data.id);

        if (response.status === 201) {
          console.log('ef----')

          toast({
            title: "Account created.",
            status: "success", 
            description: `You can now log in with your account, ${user}.`
          });

          console.log(toast)

          redirectFormLogin();
        }
      } catch (err: any) {
        console.error(err);
        const errorMessage = err.response.data.detail;
        if (errorMessage.includes("username")) setNameError(errorMessage);
        else if (errorMessage.includes("email")) setEmailError(errorMessage);
        else {
          console.log('ef-=====---')
          
          toast({
            title: "Network Error",
            status: "error", 
            description: `Please check your internet connection.`
          });

          console.log(toast)
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    affiliation,
    setAffiliation,
    state,
    setState,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    nameError,
    setNameError,
    emailError,
    setEmailError,
    affiliationError,
    setAffiliationError,
    stateError,
    setStateError,
    passwordError,
    setPasswordError,
    confirmPasswordError,
    setConfirmPasswordError,
    handleSubmit,
    isSubmitting,
    handleNameChange,
    handleEmailChange,
    handleAffiliationChange,
    handleSelectChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    passwordMatch,
    handleRegister: handleSubmit,
    selectedValue: state,
  };
};

export default useHandleRegister;
