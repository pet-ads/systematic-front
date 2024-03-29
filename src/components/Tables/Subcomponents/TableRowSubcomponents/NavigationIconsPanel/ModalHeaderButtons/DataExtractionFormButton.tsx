import { Button, Text} from "@chakra-ui/react";
import { DataExtractionFormIcon } from "../../../../../../../public/icons/StudyModal/DataExtractionFormIcon";
import ModalContext from "../../../ModalContext";
import { useContext } from "react";


export default function DataExtractionFormButton() {
    const context = useContext(ModalContext);
    function handleClick() {
        context?.setPanelState("Data Extraction Form");
    }

    return(
        <Button 
        onClick={handleClick} alignItems={"center"} gap="5" bg="gray" pl="3" pr="3" w="100%">
            <DataExtractionFormIcon /> <Text color="black" fontSize={"sm"}>Data Extraction Form</Text>
        </Button>
    );
}