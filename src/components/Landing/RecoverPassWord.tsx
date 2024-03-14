import EventButton from "../Buttons/EventButton";
import FormOptions from "./subcomponents/FormOptions";
import { FormControl, Box } from "@chakra-ui/react";
import RegisterInputs from "./subcomponents/inputs/RegisterInputs";
import useHandleRegister from "../../hooks/validation/useHandleRegister";
import { bxconteiner, evbtn, formcontrolConteiner } from "./styles/recoverStyles";

interface iRecoverProps {
  handleRender: (renderForm: string) => void;
}

export default function RecoverPassWord({ handleRender }: iRecoverProps) {
  const { handleEmailchange } = useHandleRegister();
  return (
    <Box mb={"12em"}>
      <FormControl sx={formcontrolConteiner}>
        <RegisterInputs id="mail" placeholder={"Email ..."} handlechange={handleEmailchange} />
        <Box sx={bxconteiner}>
          <EventButton
            event={() => {
              window.alert("Recover mail sent!!!");
            }}
            text={"Recover Password"}
            sx={evbtn}
          />
          <FormOptions text={"Back"} onClick={() => handleRender("Login")} />
        </Box>
      </FormControl>
    </Box>
  );
}
