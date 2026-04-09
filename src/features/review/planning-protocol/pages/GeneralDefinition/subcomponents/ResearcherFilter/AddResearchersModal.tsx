import { Button, Modal, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  researchers: any[];
  onSelectResearcher: (researcher: any) => void;
};

export default function ResearcherFilterModal({ isOpen, onClose, researchers, onSelectResearcher }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Researchers</ModalHeader>
        {researchers.map((researcher) => (
          <Button onClick={() => onSelectResearcher(researcher)}>
            {researcher.name} - {researcher.email} - {researcher.photo}
          </Button>
        ))}
      </ModalContent>
    </Modal>
  );
}
