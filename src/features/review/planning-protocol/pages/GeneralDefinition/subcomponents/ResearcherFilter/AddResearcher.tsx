import { Flex, Input, Box, Avatar, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import EventButton from "@components/common/buttons/EventButton";
import { researchersMock } from "../../../../../../../mocks/researchers";

export default function AddResearcher() {
  const [inputText, setInputText] = useState("");
  const [potentialResearchers, setPotentialResearchers] = useState(researchersMock.filter((researcher) => researcher.status == "none"));
  const [selectedPotentialResearchers, setSelectedPotentialResearchers] = useState(researchersMock.filter((researcher) => researcher.status == "none").slice(0, 3));
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [researcherChosen, setResearcherChosen] = useState(false);

  useEffect(() => {
    // simulating API call to get potential researchers
    setPotentialResearchers(researchersMock.filter((researcher) => researcher.status == "none"));
  }, []);

  const filterResearchers = (search: string) => {
    return potentialResearchers.filter((researcher) => {
      const fullResearcherReference = `${researcher.name} - ${researcher.email}`;
      return (fullResearcherReference.toLowerCase().includes(search.toLowerCase()));
    });
  };

  const handleFilterResearchers = (search: string) => {
    const filteredResearchers = filterResearchers(search);
    setSelectedPotentialResearchers(filteredResearchers.slice(0, 3));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setResearcherChosen(false);
    setSuggestionsOpen(true);
    handleFilterResearchers(e.target.value);
  };

  const handleAddResearcher = () => {
    //send researcher to server
    console.log("Adding researcher:", inputText);

    // Reset all states
    setResearcherChosen(false);
    setInputText("");
    setSuggestionsOpen(false);
    setSelectedPotentialResearchers(researchersMock.filter((researcher) => researcher.status == "none").slice(0, 3));
  };

  return (
    <Flex justify="center" py={2}>
      <Flex gap={2} align="center" width="28rem" position="relative">
        {/* Add Researcher Input */}
        <Input style = {{ backgroundColor: researcherChosen ? "#C9D9E5" : "#ffffffff" }} value={inputText} placeholder="Add a researcher" flex="1" minW={0} size="md" onChange = {handleInputChange} onFocus={() => setSuggestionsOpen(true)} onBlur={() => setSuggestionsOpen(false)}/>
        
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
                    onClick={() => {
                      setInputText(`${researcher.name} - ${researcher.email}`);
                      setResearcherChosen(true);
                      handleFilterResearchers(`${researcher.name} - ${researcher.email}`);
                      setSuggestionsOpen(false);
                    }}
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
        <EventButton
          style={{opacity: researcherChosen ? 1 : 0.30}}
          w="40px"
          flexShrink={0}
          onClick={researcherChosen ? handleAddResearcher : undefined}
          disabled={!researcherChosen}
        />
      </Flex>
    </Flex>
  )
}
