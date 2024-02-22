import { FormControl, Input, Box } from "@chakra-ui/react";
import EventButton from "../Buttons/EventButton";
import useHandleRegister from "../../hooks/validation/useHandleRegister";
import FormOptions from "./subcomponents/FormOptions";
interface iRecoverProps {
  handleRender: (renderForm: string) => void;
}
export default function RecoverPassWord({ handleRender }: iRecoverProps) {
  const { handleEmailchange } = useHandleRegister();
  return (
    <Box mb={"12em"}>
      {" "}
      <FormControl mb={10} display={"flex"} flexDir={"column"} alignItems={"center"} w={"80%"} rowGap={3}>
        <Input placeholder={"Email ..."} type={"text"} onChange={handleEmailchange} />
        <Box display={"flex"} flexDir={"row"} w={"100%"} justifyContent={"space-between"}>
          <EventButton
            event={() => {
              window.alert("Recover mail sent!!!");
            }}
            text={"Recover Password"}
            display={"flex"}
            mb={5}
            colorScheme="teal"
            variant={"solid"}
            w={"fit-content"}
          />

          <FormOptions text={"Back"} onClick={() => handleRender("Login")} />
        </Box>
      </FormControl>
    </Box>
  );
}