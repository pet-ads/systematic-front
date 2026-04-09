import { Modal, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

type Props = { isOpen: boolean; onClose: () => void; researchers: any[] };

export default function ResearcherFilterModal({ isOpen, onClose, researchers }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Researchers</ModalHeader>
        {researchers.map((researcher) => (
          <Text key={researcher.email}>{researcher.name} - {researcher.email} - {researcher.photo}</Text>
        ))}
      </ModalContent>
    </Modal>
  );
}