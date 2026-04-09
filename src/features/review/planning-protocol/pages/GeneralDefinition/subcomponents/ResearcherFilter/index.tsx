import { Button, Text } from "@chakra-ui/react";
import { potentialResearchers } from "../../../../../../../mocks/potentialResearchers";
import { addedResearchers } from "../../../../../../../mocks/addedResearchers";
import { useState } from "react";
import ResearcherFilterModal from "./AddResearchersModal";

export default function ResearcherFilter() {
  const researchers = potentialResearchers;
  const [showPotentialResearchersModal, setShowPotentialResearchersModal] = useState(false);

  return (
    <>
      <Text mt={"30px"} fontWeight={500} fontSize={"large"}>Researchers</Text>

      <Button onClick={() => setShowPotentialResearchersModal(true)}>
        Add Researchers
      </Button>

      <ResearcherFilterModal
        isOpen={showPotentialResearchersModal}
        onClose={() => setShowPotentialResearchersModal(false)}
        researchers={researchers}
      />

      {addedResearchers.map((researcher) => (
        <Text key={researcher.email}>{researcher.name} - {researcher.email} - {researcher.photo}</Text>
      ))}
    </>
  );
}
