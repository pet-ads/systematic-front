import { DeleteIcon } from "@chakra-ui/icons";
import { Text, Flex, Input, VStack, Icon } from "@chakra-ui/react";
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
          <Input placeholder="Add a researcher" flex="1" size="md" />
          <EventButton w={"40px"} />
        </Flex>
        <Flex borderWidth="1px" borderColor="gray.200" borderRadius="md" px={4} py={2} align="center" justify="space-between">
          <Text>Ana Silva - ana.silva@mock.com</Text>
          <Icon as={DeleteIcon} w={"15px"} h={"15px"} color="gray.500" />
        </Flex>
        <Flex borderWidth="1px" borderColor="gray.200" borderRadius="md" px={4} py={2} align="center" justify="space-between">
          <Text>Carlos Souza - carlos.souza@mock.com</Text>
          <Icon as={DeleteIcon} w={"15px"} h={"15px"} color="gray.500" />
        </Flex>
        <Flex borderWidth="1px" borderColor="gray.200" borderRadius="md" px={4} py={2} align="center" justify="space-between">
          <Text>Marina Costa - marina.costa@mock.com</Text>
          <Icon as={DeleteIcon} w={"15px"} h={"15px"} color="gray.500" />
        </Flex>
      </VStack>
    </>
  );
}
