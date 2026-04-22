import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useToaster from "@components/feedback/Toaster";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("review/execution-identification");

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
        title: t("dataBaseCard.deleteDatabaseModal.toasts.incorrectName.title"),
        description: t("dataBaseCard.deleteDatabaseModal.toasts.incorrectName.description"),
        status: "error",
      });
      return;
    }

    try {
      sessions.map(async (study) => {
        await UseDeleteSession({ sessionId: study.id, mutate });
      });

      toast({
        title: t("dataBaseCard.deleteDatabaseModal.toasts.success.title"),
        description: t("dataBaseCard.deleteDatabaseModal.toasts.success.description"),
        status: "success",
      });
      mutate();
      handleClose();
    } catch (err) {
      console.log(err);
      toast({
        title: t("dataBaseCard.deleteDatabaseModal.toasts.catch.title"),
        description: t("dataBaseCard.deleteDatabaseModal.toasts.catch.description"),
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
                {t("dataBaseCard.deleteDatabaseModal.heading")}
              </FormLabel>
            </Flex>
          </FormControl>
          <ModalCloseButton onClick={handleClose} />
        </ModalHeader>
        <ModalBody>
          <Flex>
            {t("dataBaseCard.deleteDatabaseModal.message")}
          </Flex>
          <FormControl mt={4} mb={3}>
            <FormLabel>
              {t("dataBaseCard.deleteDatabaseModal.label1")+databaseName+t("dataBaseCard.deleteDatabaseModal.label2")}
            </FormLabel>
            <Input
              onChange={(e) => setNameOfDatabase(e.target.value)}
              value={nameOfDatabase}
              placeholder={t("dataBaseCard.deleteDatabaseModal.placeholder")}
              aria-label={t("dataBaseCard.deleteDatabaseModal.aria-label")}
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
              {t("dataBaseCard.deleteDatabaseModal.cancel")}
            </Button>
            <Button
              onClick={deleteAllReferences}
              backgroundColor={"#263C56"}
              color={"#EBF0F3"}
              boxShadow="sm"
              _hover={{ bg: "#2A4A6D", boxShadow: "md" }}
              isDisabled={isDatabaseNameCorrect(databaseName)}
            >
              {t("dataBaseCard.deleteDatabaseModal.remove")}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteDatabaseModal;
