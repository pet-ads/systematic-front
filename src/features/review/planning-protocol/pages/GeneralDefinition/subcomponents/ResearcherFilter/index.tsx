import { Button, Text,  Flex, Input, VStack} from "@chakra-ui/react";
// import { potentialResearchersMock } from "../../../../../../../mocks/potentialResearchers";
// import { addedResearchersMock } from "../../../../../../../mocks/addedResearchers";
// import { useState } from "react";
// import type { Researcher } from "../../types";
// import ResearcherFilterModal from "./AddResearchersModal";
import EventButton from "@components/common/buttons/EventButton";

export default function ResearcherFilter() {
  // const [addedResearchers, setAddedResearchers] = useState<Researcher[]>(addedResearchersMock);
  // const [potentialResearchers, setPotentialResearchers] = useState<Researcher[]>(potentialResearchersMock);
  // const [showPotentialResearchersModal, setShowPotentialResearchersModal] = useState(false);

  // const handleSelectPotentialResearcher = (researcher: Researcher) => {
  //   setAddedResearchers((prev) => [...prev, researcher]);
  //   setPotentialResearchers((prev) => prev.filter((r) => r.id !== researcher.id));
  // };

  // const handleReturnAddedResearcher = (researcher: Researcher) => {
  //   setAddedResearchers((prev) => prev.filter((r) => r.id !== researcher.id));
  //   setPotentialResearchers((prev) => [...prev, researcher]);
  // };

  return (
    <>
      <Text mt={"30px"} fontWeight={500} fontSize={"large"}>Researchers</Text>

      {/* <Button onClick={() => setShowPotentialResearchersModal(true)}>
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
      ))} */}

      <VStack spacing={3} align="stretch">
        <Flex gap="4" align="center">
          <Text>Add</Text>
          <Input placeholder="Enter the researcher name" flex="1" size="md" />
          <EventButton w={"40px"} />
        </Flex>
        <Button variant="outline">Ana Silva - ana.silva@mock.com</Button>
        <Button variant="outline">Carlos Souza - carlos.souza@mock.com</Button>
        <Button variant="outline">Marina Costa - marina.costa@mock.com</Button>
      </VStack>
    </>
  );
}
