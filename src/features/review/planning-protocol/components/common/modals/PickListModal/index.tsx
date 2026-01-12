import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { useEffect, Dispatch, SetStateAction } from "react";
import InfosTable from "@features/review/planning-protocol/components/common/tables/InfosTable";
import {
  formcontrol,
  label,
} from "@features/review/planning-protocol/components/common/inputs/text/AddTextTable/styles";

interface Props {
  show: Dispatch<SetStateAction<boolean>>;
  questionHolder: React.Dispatch<React.SetStateAction<string[]>>;
  questions: string[];
}

export default function PickListModal({ show, questionHolder, questions }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  function close() {
    show(false);
    onClose();
  }

  const handleAddText = (value: string) => {
    questionHolder((prev) => [...prev, value]);
  };

  const handleDeleteText = (index: number) => {
    questionHolder((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={close} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Insert the options
          <ModalCloseButton onClick={close} />
        </ModalHeader>
        
        <ModalBody>
          <FormControl sx={label}>
            <FormControl sx={formcontrol}>
              <FormLabel mt={"30px"} fontWeight={500} fontSize={"large"}>
                Options
              </FormLabel>
              
              <InfosTable
                typeField=""
                onAddText={handleAddText}
                onDeleteAddedText={handleDeleteText}
                AddTexts={questions}
                context="Options"
                placeholder="Enter options here"
                referencePrefix=""
                
                enableReferenceCode={false} 
              />
            </FormControl>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={close}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}