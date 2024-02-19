import { Box, FormControl, Text } from "@chakra-ui/react";
import { useSelect } from "../../hooks/useSelect";
import GridLayout from "../../components/ui/Grid/Grid";
import Header from "../../components/ui/Header/Header";
import InputText from "../../components/Inputs/InputText";
import SelectInput from "../../components/Inputs/SelectInput";
import EventButton from "../../components/Buttons/EventButton";
import PasswordInput from "../../components/Inputs/PasswordInput";
import { SetStateAction, useState } from "react";
import EmailInput from "../../components/Inputs/EmailInput";

export default function Register() {
  const { selectedValue, handleSelectChange } = useSelect();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleEmailchange = (e: { target: { value: SetStateAction<string> } }) => {
    setEmail(e.target.value);
  };

  const isMailValid = () => {
    const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
    if (regEx.test(email)) return true;
    else if (!regEx.test(email) && email !== "") return false;
    else return false;
  };

  const handlePasswordChange = (e: { target: { value: SetStateAction<string> } }) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: { target: { value: SetStateAction<string> } }) => {
    setConfirmPassword(e.target.value);
  };

  const ArePasswordsEqual = (password: string, confirmPassword: string) => {
    return password.trim() === confirmPassword.trim();
  };

  const handleRegister = () => {
    if (!ArePasswordsEqual(password, confirmPassword)) {
      window.alert("Passwords are different!");
      return;
    }
    if (!isMailValid()) {
      window.alert("Invalid email");
      return;
    }
    window.alert("User registered with success!");
  };

  return (
    <GridLayout navigationType="Default">
      <Box
        borderWidth={"1px"}
        borderRadius={"lg"}
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        mt={10}
        mb={20}
      >
        <Header text="Create Account" />
        <Text> Already have an account? Log in</Text>
        <FormControl mb={10} display={"flex"} flexDir={"column"} alignItems={"center"}>
          <InputText label={"Name: "} placeholder={""} type={"text"} nome={"name"} />
          <EmailInput handleChange={handleEmailchange} />
          <InputText label={"Affiliation: "} placeholder={""} type={"text"} nome={"affiliattion"} />

          <FormControl display={"flex"} flexDir={"column"} gap={10} mt={10} w={"75%"} alignSelf={"center"}>
            <SelectInput
              values={["", "Brazil", "England", "France", "Spain"]}
              names={["", "Brazil", "England", "France", "Spain"]}
              label={"Country: "}
              onSelect={handleSelectChange}
              selectedValue={selectedValue}
            />
            <PasswordInput text="Choose a password:" handlechange={handlePasswordChange} />
            <PasswordInput text="Confirm your password: " handlechange={handleConfirmPasswordChange} />
          </FormControl>
        </FormControl>
        <EventButton
          event={handleRegister}
          text={"Create Account"}
          display={"flex"}
          justifySelf={"flex-end"}
          mb={5}
          colorScheme="teal"
          variant={"solid"}
          w={"200px"}
        />
      </Box>
    </GridLayout>
  );
}
