import { useSelect } from "../useSelect";
import useNameValidation from "./useNameValidation";
import useEmailValidation from "./useEmailValidation";
import usePassWordValidation from "./usePassWordValidation";
import useAffiliattionValidation from "./useAffiliattionValidation";
import {useSendUser} from './useSendUser';
import { useNavigate } from "react-router-dom";

export default function useHandleRegister() {
  const { name, handleNameChange } = useNameValidation();
  const { selectedValue, handleSelectChange } = useSelect();
  const { email, validEmail, handleEmailchange } = useEmailValidation();
  const { affiliattion, handleAffiliattionChange } = useAffiliattionValidation();
  const { password, passwordMatch, handlePasswordChange, handleConfirmPasswordChange } = usePassWordValidation();
  const navigate = useNavigate();

  const data: string[] | null= [];

  const handleRegister = async () => {
    if (name === "") {
      window.alert("Name is required!");
      return;
    }
    else{
      data.push(name);
    }
    if (!passwordMatch) {
      window.alert("Passwords don't match!");
      return;
    }
    if (password === "") {
      window.alert("Password is required!");
      return;
    }
    else{
      data.push(password);
    }
    if (email === "") {
      window.alert("email  is required!");
      return;
    }
    if (!validEmail) {
      window.alert("Invalid email");
      return;
    }
    else{
      data.push(email);
    }
    if (selectedValue === "" || selectedValue === "Select a country" || !selectedValue) {
      window.alert("Country is required");
      return;
    }
    else{
      data.push(selectedValue);
    }
    if (affiliattion === "") {
      window.alert("Affiliattion is required");
      return;
    }
    else{
      data.push(affiliattion);
      console.log(data);
      try {
        //const response = await useSendUser(data);
        const response = {status: 200};
        if (response.status === 200 || response.status === 201) {
            window.alert("User registered with success!");
            navigate("/user");
        }
    } catch (err) {
        window.alert("Registration failed. Please try again.");
    }
    }
  };

  return {
    name,
    handleNameChange,
    selectedValue,
    handleSelectChange,
    email,
    validEmail,
    handleEmailchange,
    affiliattion,
    handleAffiliattionChange,
    password,
    passwordMatch,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleRegister,
  };
}
