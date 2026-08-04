import { useTranslation } from "react-i18next";
import { Text, VStack } from "@chakra-ui/react";
import AddResearcher from "./AddResearcher";
import IncludedResearchers from "./IncludedResearchers";
import { useState, useEffect } from "react";
import useToaster from "@components/feedback/Toaster";
import { fetchCollaborators, type Researcher } from "./services/useFetchCollaborators";

export default function ResearcherFilter() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const { t } = useTranslation("review/planning-protocol");
  const toast = useToaster();
  const systematicStudyId = localStorage.getItem("systematicReviewId") ?? "";

  useEffect(() => {
    if (!systematicStudyId) return;

    fetchCollaborators(systematicStudyId)
      .then(setResearchers)
      .catch(() => {
        toast({
          title: t("generalDefinition.input.researchers.toasts.loadError.title"),
          description: t("generalDefinition.input.researchers.toasts.loadError.description"),
          status: "error",
        });
      });
  }, [systematicStudyId]);

  return (
    <>
      <Text mt={"30px"} fontWeight={500} fontSize={"large"}>{t("generalDefinition.input.researchers.label")}</Text>
      <VStack spacing={0} align="stretch" border="2px solid" borderColor="gray.300" borderRadius="md" bgColor="#ffffffff" px={2} py={2}>
        <AddResearcher researchers={researchers} setResearchers={setResearchers} systematicStudyId={systematicStudyId}/>
        <IncludedResearchers researchers={researchers} setResearchers={setResearchers} systematicStudyId={systematicStudyId}/>
      </VStack>
    </>
  );
}