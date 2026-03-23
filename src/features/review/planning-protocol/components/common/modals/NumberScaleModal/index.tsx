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
import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import NumberScaleTable from "../../tables/NumberScaleTable";
import useNumberScale from "../../../../hooks/useNumberScale";

interface Props {
  show: Dispatch<SetStateAction<boolean>>;
  scaleHolder: React.Dispatch<React.SetStateAction<number[]>>;
  values: number[];
  onSave: () => void;
}

function NumberScaleModal({ show, scaleHolder, values, onSave }: Props) {
  const { handleMinimalValue, handleMaximalValue, minimalValue, maximalValue } =
    useNumberScale();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    // console.log(values);
    onOpen();
    handleMinimalValue("", values[0]);
    handleMaximalValue("", values[1]);
  }, []);

  function handleSave() {
    if (minimalValue < maximalValue) {
      let array: number[] = [minimalValue, maximalValue];
      scaleHolder(array);
    }
    setTimeout(() => {
      onSave();
    }, 0);
    onClose();
    show(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Values to number scale
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody>
          <NumberScaleTable
            handleMaximalValue={handleMaximalValue}
            handleMinimalValue={handleMinimalValue}
            minimalValue={minimalValue}
            maximalValue={maximalValue}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} m={"1rem"}>
            Close
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NumberScaleModal;
