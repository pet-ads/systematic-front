import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import AddPickListTable from "@features/review/planning-protocol/pages/StepThree/subcomponents/inputs/pickList/AddPickListTable";
import { useEffect } from "react";

import { Dispatch, SetStateAction } from "react";

interface Props {
  show: Dispatch<SetStateAction<boolean>>;
  optionHolder: React.Dispatch<React.SetStateAction<string[]>>;
  options: string[];
}

function PickManyModal({ show, optionHolder, options }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  function close() {
    show(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Insert multiple options
          <ModalCloseButton onClick={close} />
        </ModalHeader>
        <ModalBody>
          <AddPickListTable
            text="Multiple Options"
            placeholder="Type an option"
            questionHolder={optionHolder}
            questions={options}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={close}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PickManyModal;
