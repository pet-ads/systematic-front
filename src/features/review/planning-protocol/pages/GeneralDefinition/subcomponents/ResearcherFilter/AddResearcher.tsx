import { Flex, Input, Box, Avatar, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import EventButton from "@components/common/buttons/EventButton";
import { potentialResearchersMock } from "../../../../../../../mocks/potentialResearchers";

export default function AddResearcher() {
  const [potentialResearchers, setPotentialResearchers] = useState(potentialResearchersMock);
  const [selectedPotentialResearchers, setSelectedPotentialResearchers] = useState(potentialResearchersMock.slice(0, 3));
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  useEffect(() => {
    // simulating API call to get potential researchers
    setPotentialResearchers(potentialResearchersMock);
  }, []);

  return (
    <Flex justify="center" py={2}>
      <Flex gap={2} align="center" width="28rem" position="relative">
        <Input placeholder="Add a researcher" flex="1" minW={0} size="md" onFocus={() => setSuggestionsOpen(true)} onBlur={() => setSuggestionsOpen(false)}/>
        <EventButton w="40px" flexShrink={0} />
        {suggestionsOpen && (
          <Box position="absolute" width="25rem" top="100%" mt={1} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
            {selectedPotentialResearchers.map((researcher) => (
              <Flex key={researcher.id} align="center" gap={3} px={3} py={2}>
              <Avatar size="sm" name="Potential Researcher 1" />
                <Text flex="1" fontSize="sm">{researcher.name} - {researcher.email}</Text>
              </Flex>
            ))}
          </Box>
        )}
      </Flex>
    </Flex>
  );
}
