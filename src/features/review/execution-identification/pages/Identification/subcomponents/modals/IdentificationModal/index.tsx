import { useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
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
  Textarea,
  Box,
  IconButton,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";

import { KeyedMutator } from "swr";
import StudyContext from "@features/review/shared/context/StudiesContext";
import useHandleExportedFiles from "@features/review/execution-identification/services/useHandleExportedFiles";
import useUpdateSession from "@features/review/execution-identification/services/useUpdateSession";
import DragAndDrop from "@components/common/inputs/DragAndDropInput";
import Axios from "../../../../../../../../infrastructure/http/axiosClient";

interface IdentificationModalProps {
  sessionId?: string,
  show: (value: boolean) => void;
  action: "create" | "update";
  type: string;
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
}

function IdentificationModal({
  sessionId,
  show,
  action,
  type,
  mutate,
}: IdentificationModalProps) {
  const [searchString, setSearchString] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { t } = useTranslation("review/execution-identification");

  const studiesContext = useContext(StudyContext);
  if (!studiesContext)
    throw new Error("Failed to get selection context on identification modal!");
  const reloadArticles = studiesContext.reloadArticles;

  const {
    handleFile,
    referenceFiles,
    setReferenceFiles,
    sendFilesToServer,
    setSource,
  } = useHandleExportedFiles({
    mutate: mutate,
    setInvalidEntries: studiesContext.setInvalidEntries,
    searchString,
    comment,
  });

  const { updateSession } = useUpdateSession({ 
    sessionId, 
    mutate, 
    searchString, 
    comment, 
    type
  });


  useEffect(() => {
    const fetchSession = async () => {  
      setSource(type);
      onOpen();

      if(action === "update") {
        const id = localStorage.getItem("systematicReviewId");
        try {
          const response = await Axios.get(`/systematic-study/${id}/search-session`);
          const selectedSession = response.data.searchSessions.find((session : any) => session.id === sessionId);
          if(selectedSession) {
            setSearchString(selectedSession.searchString);
            setComment(selectedSession.additionalInfo);
          }
        } catch(error) {
          const toast = useToaster();
          toast({
            title: "Failed to load session",
            description: "We couldn’t retrieve the session data. Please check your connection or try again later.",
            status: "error",
          });
        }
      } 
    };

    fetchSession();
  }, []);

  const handleSearchStringChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSearchString(e.target.value);
    if (isError) setIsError(false);
  };

  const handleSubmit = () => {
    if (searchString.trim() === "") {
      setIsError(true);
      return;
    }

    if(action === "create") {
      sendFilesToServer();
    } else {
      updateSession();
    }
    reloadArticles("Selection");
    show(false);
    onClose();
  };

  const handleClose = () => {
    show(false);
    onClose();
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  function removeReferenceFile(index: number) {
    setReferenceFiles(referenceFiles.filter((_, i) => i !== index));
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={"#263C56"}>
          {action == "create" ? t("dataBaseCard.identificationModal.heading.create") : t("dataBaseCard.identificationModal.heading.update")}
          <ModalCloseButton onClick={handleClose} />
        </ModalHeader>
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>{t("dataBaseCard.identificationModal.input.date")}</FormLabel>
            <Input type="date" defaultValue={getCurrentDate()} />
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={isError}>
            <FormLabel>{t("dataBaseCard.identificationModal.input.searchString.label")}</FormLabel>
            <Textarea
              placeholder={t("dataBaseCard.identificationModal.input.searchString.placeholder")}
              value={searchString}
              onChange={handleSearchStringChange}
            />
            {isError && (
              <FormErrorMessage>{t("dataBaseCard.identificationModal.input.searchString.error")}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>{t("dataBaseCard.identificationModal.input.comments.label")}</FormLabel>
            <Textarea
              placeholder={t("dataBaseCard.identificationModal.input.comments.placeholder")}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </FormControl>
          {action == "create" && (
            <FormControl mb={4}>
              <FormLabel>{t("dataBaseCard.identificationModal.input.referenceFiles.label")}</FormLabel>
              {referenceFiles.map((file, index) => (
                <Flex key={index} alignItems="center" mb={2}>
                  <Box flex="1" border="1px" borderRadius="md" p={2}>
                    {file.name}
                  </Box>
                  <IconButton
                    aria-label={t("dataBaseCard.identificationModal.input.referenceFiles.aria-label")}
                    icon={<DeleteIcon />}
                    ml={2}
                    gap={1}
                    onClick={() => removeReferenceFile(index)}
                  />
                </Flex>
              ))}
              <DragAndDrop handleFileChange={handleFile} />
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleSubmit}
            backgroundColor={"#263C56"}
            color={"#EBF0F3"}
            boxShadow="sm"
            _hover={{ bg: "#2A4A6D", boxShadow: "md" }}
          >
            {action == "create" ? t("dataBaseCard.identificationModal.button.create") : t("dataBaseCard.identificationModal.button.update")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default IdentificationModal;
