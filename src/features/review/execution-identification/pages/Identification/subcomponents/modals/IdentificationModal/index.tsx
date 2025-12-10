import { useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

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
import StudySelectionContext from "@features/review/shared/context/StudiesSelectionContext";
import useHandleExportedFiles from "@features/review/execution-identification/services/useHandleExportedFiles";
import DragAndDrop from "@components/common/inputs/DragAndDropInput";

interface IdentificationModalProps {
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
  show,
  action,
  type,
  mutate,
}: IdentificationModalProps) {
  const [searchString, setSearchString] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const selectionContext = useContext(StudySelectionContext);
  if (!selectionContext)
    throw new Error("Failed to get selection context on identification modal!");
  const reloadArticles = selectionContext.reloadArticles;

  const {
    handleFile,
    referenceFiles,
    setReferenceFiles,
    sendFilesToServer,
    setSource,
  } = useHandleExportedFiles({
    mutate: mutate,
    setInvalidEntries: selectionContext.setInvalidEntries,
    searchString,
    comment,
  });

  useEffect(() => {
    setSource(type);
    onOpen();
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

    sendFilesToServer();
    reloadArticles();
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
          {action == "create" ? "New Search Session" : "Update Session"}
          <ModalCloseButton onClick={handleClose} />
        </ModalHeader>
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Date</FormLabel>
            <Input type="date" defaultValue={getCurrentDate()} />
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={isError}>
            <FormLabel>Search String</FormLabel>
            <Textarea
              placeholder="Enter your search string"
              value={searchString}
              onChange={handleSearchStringChange}
            />
            {isError && (
              <FormErrorMessage>Search string is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Comments</FormLabel>
            <Textarea
              placeholder="Add comments"
              onChange={(event) => setComment(event.target.value)}
            />
          </FormControl>
          {action == "create" && (
            <FormControl mb={4}>
              <FormLabel>Reference Files</FormLabel>
              {referenceFiles.map((file, index) => (
                <Flex key={index} alignItems="center" mb={2}>
                  <Box flex="1" border="1px" borderRadius="md" p={2}>
                    {file.name}
                  </Box>
                  <IconButton
                    aria-label="Remove file"
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
            {action == "create" ? "Create" : "Update"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default IdentificationModal;
