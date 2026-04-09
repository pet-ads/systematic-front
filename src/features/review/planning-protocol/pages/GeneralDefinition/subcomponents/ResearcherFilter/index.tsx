import { Button, Text } from "@chakra-ui/react";
import { potentialResearchersMock } from "../../../../../../../mocks/potentialResearchers";
import { addedResearchersMock } from "../../../../../../../mocks/addedResearchers";
import { useState } from "react";
import type { Researcher } from "../../types";
import ResearcherFilterModal from "./AddResearchersModal";

export default function ResearcherFilter() {
  const [addedResearchers, setAddedResearchers] = useState<Researcher[]>(addedResearchersMock);
  const [potentialResearchers, setPotentialResearchers] = useState<Researcher[]>(potentialResearchersMock);
  const [showPotentialResearchersModal, setShowPotentialResearchersModal] = useState(false);

  const handleSelectPotentialResearcher = (researcher: Researcher) => {
    setAddedResearchers((prev) => [...prev, researcher]);
    setPotentialResearchers((prev) => prev.filter((r) => r.id !== researcher.id));
  };

  const handleReturnAddedResearcher = (researcher: Researcher) => {
    setAddedResearchers((prev) => prev.filter((r) => r.id !== researcher.id));
    setPotentialResearchers((prev) => [...prev, researcher]);
  };

  return (
    <>
      <Text mt={"30px"} fontWeight={500} fontSize={"large"}>Researchers</Text>

      <Button onClick={() => setShowPotentialResearchersModal(true)}>
        Add Researchers
      </Button>

      <ResearcherFilterModal
        isOpen={showPotentialResearchersModal}
        onClose={() => setShowPotentialResearchersModal(false)}
        researchers={potentialResearchers}
        onSelectResearcher={handleSelectPotentialResearcher}
      />

      {addedResearchers.map((researcher) => (
        <Button key={researcher.id} onClick={() => handleReturnAddedResearcher(researcher)}>
          {researcher.name} - {researcher.email} - {researcher.photo}
        </Button>
      ))}
    </>
  );
}
