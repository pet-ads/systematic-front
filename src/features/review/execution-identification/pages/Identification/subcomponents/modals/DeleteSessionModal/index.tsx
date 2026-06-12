import { useEffect, useState } from "react";
import { Button, Divider, Flex, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { IoIosWarning } from "react-icons/io";
import { useDisclosure } from "@chakra-ui/react";
import { KeyedMutator } from "swr";
import { useTranslation } from "react-i18next";
import useToaster from "@components/feedback/Toaster";

import Axios from "../../../../../../../../infrastructure/http/axiosClient";
import UseDeleteSession from "../../../../../services/useDeleteSession";

interface Session {
  id: string;
  systematicStudyd: string;
  userId: string;
  searchString: string;
  additionalInfo: string;
  timestamp: string;
  source: string;
  numberOfRelatedStudies: number;
}

interface DeleteSessionModalProps {
  show: (value: boolean) => void;
  session: Session;
  mutate: KeyedMutator<Session[]>;
}

type SelectionStatus = "INCLUDED" | "EXCLUDED" | "DUPLICATED" | "UNCLASSIFIED";

async function canDeleteSession(
  reviewId: string,
  sessionId: string,
  numberOfRelatedStudies: number
): Promise<boolean> {
  if (numberOfRelatedStudies === 0) return true;

  const size = Math.max(numberOfRelatedStudies, 1);
  const path = `systematic-study/${reviewId}/find-by-search-session/${sessionId}`;
  const response = await Axios.get(path, { params: { page: 0, size } });
  const studies = response.data?.studyReviews ?? [];

  const blockedStatuses: SelectionStatus[] = ["INCLUDED", "EXCLUDED", "DUPLICATED"];

  return !studies.some((s: any) =>
    blockedStatuses.includes(s.selectionStatus as SelectionStatus)
  );
}

export default function DeleteSessionModal({
  show,
  session,
  mutate,
}: DeleteSessionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const toast = useToaster();
  const { t } = useTranslation("review/execution-identification");
  const reviewId = localStorage.getItem("systematicReviewId") ?? "";

  useEffect(() => {
    onOpen();
    checkIfCanDelete();
  }, []);

  const checkIfCanDelete = async () => {
    setIsChecking(true);
    try {
      const result = await canDeleteSession(
        reviewId,
        session.id,
        session.numberOfRelatedStudies
      );
      setCanDelete(result);
    } catch {
      setCanDelete(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClose = () => {
    show(false);
    onClose();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await UseDeleteSession({ sessionId: session.id, mutate });
      toast({
        title: t("dataBaseCard.deleteSessionModal.toasts.success.title"),
        description: t("dataBaseCard.deleteSessionModal.toasts.success.description"),
        status: "success",
      });
      handleClose();
    } catch {
      toast({
        title: t("dataBaseCard.deleteSessionModal.toasts.catch.title"),
        description: t("dataBaseCard.deleteSessionModal.toasts.catch.description"),
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
                {t("dataBaseCard.deleteSessionModal.heading")}
              </FormLabel>
            </Flex>
          </FormControl>
          <ModalCloseButton onClick={handleClose} />
        </ModalHeader>

        <ModalBody>
          {isChecking ? (
            <Text color="gray.500">
              {t("dataBaseCard.deleteSessionModal.checking")}
            </Text>
          ) : canDelete ? (
            <Text>
              {t("dataBaseCard.deleteSessionModal.confirmMessage")}
            </Text>
          ) : (
            <Flex direction="column" gap={2}>
              <Text fontWeight="semibold" color="red.500">
                {t("dataBaseCard.deleteSessionModal.blockedTitle")}
              </Text>
              <Text>
                {t("dataBaseCard.deleteSessionModal.blockedMessage")}
              </Text>
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
              {t("dataBaseCard.deleteSessionModal.cancel")}
            </Button>

            {canDelete && !isChecking && (
              <Button
                onClick={handleConfirmDelete}
                backgroundColor="red.500"
                color="white"
                boxShadow="sm"
                _hover={{ bg: "red.600", boxShadow: "md" }}
                isDisabled={isDeleting}
                isLoading={isDeleting}
              >
                {t("dataBaseCard.deleteSessionModal.confirm")}
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}