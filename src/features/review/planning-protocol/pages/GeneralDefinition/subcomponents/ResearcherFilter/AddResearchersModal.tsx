import { Button, Modal, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import type { Researcher } from "../../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  researchers: Researcher[];
  onSelectResearcher: (researcher: Researcher) => void;
};

export default function ResearcherFilterModal({ isOpen, onClose, researchers, onSelectResearcher }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Researchers</ModalHeader>
        {researchers.map((researcher) => (
          <Button key={researcher.id} onClick={() => onSelectResearcher(researcher)}>
            {researcher.name} - {researcher.email} - {researcher.photo}
          </Button>
        ))}
      </ModalContent>
    </Modal>
  );
}
