import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Icon, Text } from "@chakra-ui/react";

export default function IncludedResearchers() {
  return (
    <>
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
    </>
  );
}
