import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Icon, Text, Avatar } from "@chakra-ui/react";

export default function IncludedResearchers() {
  return (
    <>
      <Flex align="center" gap={4} px={4} py={2} borderWidth="1px" borderColor="gray.200" borderRadius="md">
        <Avatar size="sm" name="Ana Silva" />
        <Flex borderColor="gray.200" borderRadius="md"  align="center" justify="space-between" flex="1">
          <Text>Ana Silva - ana.silva@gmail.com</Text>
          <Icon as={DeleteIcon} w="15px" h="15px" color="gray.500" />
        </Flex>
      </Flex>
    </>
  );
}
