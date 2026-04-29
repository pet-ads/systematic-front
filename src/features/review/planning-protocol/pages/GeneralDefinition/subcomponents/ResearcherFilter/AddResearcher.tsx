import { Flex, Input, Box, Avatar, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import EventButton from "@components/common/buttons/EventButton";
import { potentialResearchersMock } from "../../../../../../../mocks/potentialResearchers";

export default function AddResearcher() {
  const [inputText, setInputText] = useState("");
  const [potentialResearchers, setPotentialResearchers] = useState(potentialResearchersMock);
  const [selectedPotentialResearchers, setSelectedPotentialResearchers] = useState(potentialResearchersMock.slice(0, 3));
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  useEffect(() => {
    // simulating API call to get potential researchers
    setPotentialResearchers(potentialResearchersMock);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    const filteredResearchers = potentialResearchers.filter((researcher) => {
      const fullResearcherReference = `${researcher.name} - ${researcher.email}`;
      return (fullResearcherReference.toLowerCase().includes(e.target.value.toLowerCase()));
    });
    setSelectedPotentialResearchers(filteredResearchers.slice(0, 3));
  };

  const handleAddResearcher = () => {
    //send researcher to server
    
  };

  return (
    <Flex justify="center" py={2}>
      <Flex gap={2} align="center" width="28rem" position="relative">
        {/* Add Researcher Input */}
        <Input value={inputText} placeholder="Add a researcher" flex="1" minW={0} size="md" onChange = {handleInputChange} onFocus={() => setSuggestionsOpen(true)} onBlur={() => setSuggestionsOpen(false)}/>
        
        {/* Suggestions */}
        {suggestionsOpen && (
            <Box position="absolute" width="25rem" top="100%" mt={1} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
              {selectedPotentialResearchers.length > 0 ? (
                selectedPotentialResearchers.map((researcher) => (
                  <Flex
                    key={researcher.id}
                    align="center"
                    gap={3}
                    px={3}
                    py={2}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {setInputText(`${researcher.name} - ${researcher.email}`);}}
                  >
                    <Avatar size="sm" name="Potential Researcher 1" />
                    <Text flex="1" fontSize="sm">{researcher.name} - {researcher.email}</Text>
                  </Flex>
                ))
              ) : (
                <Text color="gray.500" textAlign="center">No researchers found</Text>
              )
            }
        </Box>
        )}

        {/* Add button */}
        <EventButton w="40px" flexShrink={0} onClick={handleAddResearcher}/>
      </Flex>
    </Flex>
  )
}
