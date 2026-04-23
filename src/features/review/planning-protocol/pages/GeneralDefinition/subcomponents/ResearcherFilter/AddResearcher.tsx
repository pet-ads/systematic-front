import { Flex, Input, Box, Avatar, Text } from "@chakra-ui/react";
import { useState } from "react";
import EventButton from "@components/common/buttons/EventButton";

export default function AddResearcher() {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  return (
    <Flex justify="center" py={2}>
      <Flex gap={2} align="center" width="28rem" position="relative">
        <Input placeholder="Add a researcher" flex="1" minW={0} size="md" onFocus={() => setSuggestionsOpen(true)} onBlur={() => setSuggestionsOpen(false)}/>
        <EventButton w="40px" flexShrink={0} />
        {suggestionsOpen && (
          <Box position="absolute" width="25rem" top="100%" mt={1} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
            <Flex align="center" gap={3} px={3} py={2}>
              <Avatar size="sm" name="Potential Researcher 1" />
              <Text flex="1" fontSize="sm">Potential Researcher 1 - unincluded1@gmail.com</Text>
            </Flex>
            <Flex align="center" gap={3} px={3} py={2}>
              <Avatar size="sm" name="Potential Researcher 2" />
              <Text flex="1" fontSize="sm">Potential Researcher 2 - unincluded2@gmail.com</Text>
            </Flex>
            <Flex align="center" gap={3} px={3} py={2}>
              <Avatar size="sm" name="Potential Researcher 3" />
              <Text flex="1" fontSize="sm">Potential Researcher 3 - unincluded3@gmail.com</Text>
            </Flex>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}
