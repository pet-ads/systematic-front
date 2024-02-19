import { Box, FormControl, Text } from "@chakra-ui/react";
import { useSelect } from "../../hooks/useSelect";
import GridLayout from "../../components/ui/Grid/Grid";
import Header from "../../components/ui/Header/Header";
import InputText from "../../components/Inputs/InputText";
import SelectInput from "../../components/Inputs/SelectInput";
import EventButton from "../../components/Buttons/EventButton";
import PasswordInput from "../../components/Inputs/PasswordInput";
//import { useState } from "react";
import EmailInput from "../../components/Inputs/EmailInput";
import usePassWordValidation from "../../hooks/validation/usePassWordValidation";
import useEmailValidation from "../../hooks/validation/useEmailValidation";
import useNameValidation from "../../hooks/validation/useNameValidation";
import useAffiliattionValidation from "../../hooks/validation/useAffiliattionValidation";

export default function Register() {
  const { selectedValue, handleSelectChange } = useSelect();
  const { name, handleNameChange } = useNameValidation();
  //const [affiliattion, setAffiliattion] = useState("");
  const { affiliattion, handleAffiliattionChange } = useAffiliattionValidation();
  const { email, validEmail, handleEmailchange } = useEmailValidation();
  const { password, passwordMatch, handlePasswordChange, handleConfirmPasswordChange } = usePassWordValidation();

  /*const handleAffiliattionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const affiliattionValue = e.target.value;
    setAffiliattion(affiliattionValue);
  };*/

  const handleRegister = () => {
    if (name === "") {
      window.alert("Name is required!");
      return;
    }
    if (affiliattion === "") {
      window.alert("Affiliattion is required");
      return;
    }

    if (email === "") {
      window.alert("email  is required!");
      return;
    }
    if (!validEmail) {
      window.alert("Invalid email");
      return;
    }
    if (selectedValue === "") {
      window.alert("Country is required");
      return;
    }
    if (!passwordMatch) {
      window.alert("Passwords don't match!");
      return;
    }
    if (password === "") {
      window.alert("Password is required!");
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
          <InputText label={"Name: "} placeholder={""} type={"text"} nome={"name"} onChange={handleNameChange} />
          <EmailInput handleChange={handleEmailchange} />
          <InputText
            label={"Affiliation: "}
            placeholder={""}
            type={"text"}
            nome={"affiliattion"}
            onChange={handleAffiliattionChange}
          />

          <FormControl display={"flex"} flexDir={"column"} gap={10} mt={10} w={"75%"} alignSelf={"center"}>
            <SelectInput
              values={["", "Brazil", "England", "France", "Spain"]}
              names={["", "Brazil", "England", "France", "Spain"]}
              label={"Country: "}
              onSelect={handleSelectChange}
              selectedValue={selectedValue}
            />
            <PasswordInput text="Choose a password:" handlechange={handlePasswordChange} isValid={passwordMatch} />
            <PasswordInput
              text="Confirm your password: "
              handlechange={handleConfirmPasswordChange}
              isValid={passwordMatch}
            />
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
