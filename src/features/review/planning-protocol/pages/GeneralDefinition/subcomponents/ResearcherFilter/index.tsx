import { DeleteIcon } from "@chakra-ui/icons";
import { Text, Flex, Input, VStack, Icon, Box, Avatar } from "@chakra-ui/react";
import { useState } from "react";
import EventButton from "@components/common/buttons/EventButton";

export default function ResearcherFilter() {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  return (
    <>
      <Text mt={"30px"} fontWeight={500} fontSize={"large"}>Researchers</Text>

      <VStack spacing={0} align="stretch" border="2px solid" borderColor="gray.300" borderRadius="md" bgColor="#ffffffff" px={2} py={2}>
        <Flex justify="center" py={2}>
          <Flex gap={2} align="center" width="28rem" position="relative">
            <Input
              placeholder="Add a researcher"
              flex="1"
              minW={0}
              size="md"
              onFocus={() => setSuggestionsOpen(true)}
              onBlur={() => setSuggestionsOpen(false)}
            />
            <EventButton w="40px" flexShrink={0} />
            {suggestionsOpen && (
              <Box position="absolute" width = "25rem" top="100%" mt={1} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
                <Flex align="center" gap={3} px={3} py={2} _hover={{ bg: "gray.50" }}>
                  <Avatar size="sm" name="Potential Researcher 1" />
                  <Text flex="1" minW={0} fontSize="sm">Potential Researcher 1 - unincluded1@gmail.com</Text>
                </Flex>
                <Flex align="center" gap={3} px={3} py={2} _hover={{ bg: "gray.50" }}>
                  <Avatar size="sm" name="Potential Researcher 2" />
                  <Text flex="1" minW={0} fontSize="sm">Potential Researcher 2 - unincluded2@gmail.com</Text>
                </Flex>
                <Flex align="center" gap={3} px={3} py={2} _hover={{ bg: "gray.50" }}>
                  <Avatar size="sm" name="Potential Researcher 3" />
                  <Text flex="1" minW={0} fontSize="sm">Potential Researcher 3 - unincluded3@gmail.com</Text>
                </Flex>
              </Box>
            )}
          </Flex>
        </Flex>
        <Flex borderWidth="1px" borderColor="gray.200" borderRadius="md" px={4} py={2} align="center" justify="space-between">
          <Text>Ana Silva - ana.silva@mock.com</Text>
          <Icon as={DeleteIcon} w="15px" h="15px" color="gray.500" />
        </Flex>
        <Flex borderWidth="1px" borderColor="gray.200" borderRadius="md" px={4} py={2} align="center" justify="space-between">
          <Text>Carlos Souza - carlos.souza@mock.com</Text>
          <Icon as={DeleteIcon} w="15px" h="15px" color="gray.500" />
        </Flex>
        <Flex borderWidth="1px" borderColor="gray.200" borderRadius="md" px={4} py={2} align="center" justify="space-between">
          <Text>Marina Costa - marina.costa@mock.com</Text>
          <Icon as={DeleteIcon} w="15px" h="15px" color="gray.500" />
        </Flex>
      </VStack>
    </>
  );
}
