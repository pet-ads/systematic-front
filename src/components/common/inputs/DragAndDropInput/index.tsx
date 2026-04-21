import { useDropzone } from "react-dropzone";
import { Box, Icon, Text, VStack } from "@chakra-ui/react";
import { FaFileAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface DragAndDropProps {
  handleFileChange: (files: { acceptedFiles: File[] }) => void;
}

export default function DragAndDrop({ handleFileChange }: DragAndDropProps) {
  const onDrop = (acceptedFiles: File[]) => {
    handleFileChange({ acceptedFiles });
};

  const { t } = useTranslation("review/execution-identification");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-bibtex': [".bib"], 'application/rdf+xml': [".ris"]}

  });

  return (
    <Box
      {...getRootProps()}
      border="2px dashed"
      borderColor={isDragActive ? "#3367a8" : "#263C56"}
      borderRadius="md"
      p={6}
      textAlign="center"
      cursor="pointer"
      _hover={{ borderColor: "#3a76c4" }}
      transition="border-color 0.3s ease"
    >
      <input {...getInputProps()} accept=".bib,.ris"/>
      <VStack spacing={2}>
        <Icon as={FaFileAlt} boxSize={6} color="#263C56" />
        <Text fontSize="md" color="#263C56">
          {isDragActive ? t("dataBaseCard.identificationModal.input.referenceFiles.dragAndDrop.activeDrag") : t("dataBaseCard.identificationModal.input.referenceFiles.dragAndDrop.inactiveDrag")}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {t("dataBaseCard.identificationModal.input.referenceFiles.dragAndDrop.supported")}
        </Text>
      </VStack>
    </Box>
  );
}
