import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useToaster from "@components/feedback/Toaster";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Divider,
} from "@chakra-ui/react";

// Icon
import { IoIosWarning } from "react-icons/io";

import { KeyedMutator } from "swr";
import UseDeleteSession from "@features/review/execution-identification/services/useDeleteSession";

interface DeleteDatabaseModalProps {
  show: (value: boolean) => void;
  action: "delete" | "refuse";
  sessions: {
    id: string;
    systematicStudyd: string;
    userId: string;
    searchString: string;
    additionalInfo: string;
    timestamp: string;
    source: string;
    numberOfRelatedStudies: number;
  }[];
  // setSessions?:Dispatch<SetStateAction<{ id: string; systematicStudyd: string; userId: string; searchString: string; additionalInfo: string; timestamp: string; source: string; numberOfRelatedStudies: number; }[]>>;
  mutate: KeyedMutator<
    {
      id: string;
      systematicStudyd: string;
      userId: string;
      searchString: string;
      additionalInfo: string;
      timestamp: string;
      source: string;
      numberOfRelatedStudies: number;
    }[]
  >;
  databaseName: string;
}

// function DeleteDatabaseModal({ show, sessions, setSessions, databaseName}: DeleteDatabaseModalProps) {
function DeleteDatabaseModal({
  show,
  sessions,
  mutate,
  databaseName,
}: DeleteDatabaseModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [nameOfDatabase, setNameOfDatabase] = useState<string>("");
  const toast = useToaster();

  useEffect(() => {
    onOpen();
  }, []);

  const handleClose = () => {
    show(false);
    onClose();
  };

  const isDatabaseNameCorrect = (name: string) => {
    return nameOfDatabase.trim() !== name.trim();
  };

  const deleteAllReferences = async () => {
    if (isDatabaseNameCorrect(nameOfDatabase)) {
      toast({
        title: "Invalid Database Name",
        description: "Please enter the correct database name to proceed.",
        status: "error",
      });
      return;
    }

    try {
      sessions.map(async (study) => {
        await UseDeleteSession({ sessionId: study.id, mutate });
      });

      toast({
        title: "All Study Sessions Deleted!",
        description: "Your study sessions have been successfully removed.",
        status: "success",
      });
      mutate();
      handleClose();
    } catch (err) {
      console.log(err);
      toast({
        title: "Action Failed",
        description: "Please ensure the field is filled before proceeding.",
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={"#263C56"}>
          <FormControl
            mt={3}
            display="flex"
            mb={4}
            gap={3}
            justifyContent="left"
            alignItems="center"
          >
            <Flex gap={3}>
              <IoIosWarning size="2rem" />
              <FormLabel fontWeight="bold" fontSize="larger">
                Delete all session studies
              </FormLabel>
            </Flex>
          </FormControl>
          <ModalCloseButton onClick={handleClose} />
        </ModalHeader>
        <ModalBody>
          <Flex>
            Are you sure you want to delete all references in the database? This
            action is permanent and cannot be undone.
          </Flex>
          <FormControl mt={4} mb={3}>
            <FormLabel>
              To delete data from "{databaseName}", write the database name
              below:
            </FormLabel>
            <Input
              onChange={(e) => setNameOfDatabase(e.target.value)}
              value={nameOfDatabase}
              placeholder="Enter database name"
              aria-label="Database name input"
            />
          </FormControl>
        </ModalBody>
        <Divider colorScheme="purple.400" />
        <ModalFooter mt={3}>
          <Flex alignItems="center" justifyContent="space-evenly" gap={2}>
            <Button
              onClick={handleClose}
              backgroundColor={"#263C56"}
              color={"#EBF0F3"}
              boxShadow="sm"
              _hover={{ bg: "#2A4A6D", boxShadow: "md" }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteAllReferences}
              backgroundColor={"#263C56"}
              color={"#EBF0F3"}
              boxShadow="sm"
              _hover={{ bg: "#2A4A6D", boxShadow: "md" }}
              isDisabled={isDatabaseNameCorrect(databaseName)}
            >
              Remove
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteDatabaseModal;
