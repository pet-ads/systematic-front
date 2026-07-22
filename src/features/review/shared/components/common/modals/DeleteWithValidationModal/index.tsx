import { useEffect, useState } from "react";
import { Button, Divider, Flex, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { IoIosWarning } from "react-icons/io";
import { useDisclosure } from "@chakra-ui/react";
import useToaster from "@components/feedback/Toaster";

interface Labels {
  heading: string;
  confirmMessage: string;
  blockedTitle: string;
  blockedMessage: string;
  checking: string;
  cancel: string;
  confirm: string;
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  errorDescription: string;
}

interface DeleteWithValidationModalProps {
  checkCanDelete: () => Promise<boolean>;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  labels: Labels;
}

export default function DeleteWithValidationModal({
  checkCanDelete,
  onConfirm,
  onClose: onCloseProp,
  labels,
}: DeleteWithValidationModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isChecking, setIsChecking] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToaster();

  useEffect(() => {
    onOpen();
    runCheck();
  }, []);

  const runCheck = async () => {
    setIsChecking(true);
    try {
      const result = await checkCanDelete();
      setCanDelete(result);
    } catch {
      setCanDelete(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClose = () => {
    onCloseProp();
    onClose();
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      toast({
        title: labels.successTitle,
        description: labels.successDescription,
        status: "success",
      });
      handleClose();
    } catch {
      toast({
        title: labels.errorTitle,
        description: labels.errorDescription,
        status: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#263C56">
          <FormControl mt={3} display="flex" mb={4} gap={3} alignItems="center">
            <Flex gap={3}>
              <IoIosWarning size="2rem" />
              <FormLabel fontWeight="bold" fontSize="larger">
                {labels.heading}
              </FormLabel>
            </Flex>
          </FormControl>
          <ModalCloseButton onClick={handleClose} />
        </ModalHeader>

        <ModalBody>
          {isChecking ? (
            <Text color="gray.500">{labels.checking}</Text>
          ) : canDelete ? (
            <Text>{labels.confirmMessage}</Text>
          ) : (
            <Flex direction="column" gap={2}>
              <Text fontWeight="semibold" color="red.500">
                {labels.blockedTitle}
              </Text>
              <Text>{labels.blockedMessage}</Text>
            </Flex>
          )}
        </ModalBody>

        <Divider />

        <ModalFooter mt={3}>
          <Flex gap={2} justifyContent="flex-end">
            <Button
              onClick={handleClose}
              backgroundColor="#263C56"
              color="#EBF0F3"
              boxShadow="sm"
              _hover={{ bg: "#2A4A6D", boxShadow: "md" }}
              isDisabled={isDeleting}
            >
              {labels.cancel}
            </Button>

            {canDelete && !isChecking && (
              <Button
                onClick={handleConfirm}
                backgroundColor="red.500"
                color="white"
                boxShadow="sm"
                _hover={{ bg: "red.600", boxShadow: "md" }}
                isDisabled={isDeleting}
                isLoading={isDeleting}
              >
                {labels.confirm}
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}