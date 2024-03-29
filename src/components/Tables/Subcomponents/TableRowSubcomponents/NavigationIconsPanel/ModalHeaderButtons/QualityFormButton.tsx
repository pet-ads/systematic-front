import { Button, Text} from "@chakra-ui/react";
import { QualityFormIcon } from "../../../../../../../public/icons/StudyModal/QualityFormIcon";
import ModalContext from "../../../ModalContext";
import { useContext } from "react";


export default function QualityFormButton() {
    const context = useContext(ModalContext);
    function handleClick() {
        context?.setPanelState("Quality Form");
    }

    return(
        <Button 
        onClick={handleClick} alignItems={"center"} gap="5" bg="gray" pl="3" pr="3" w="100%">
            <QualityFormIcon /> <Text color="black" fontSize={"sm"}>Quality Form</Text>
        </Button>
    );
}