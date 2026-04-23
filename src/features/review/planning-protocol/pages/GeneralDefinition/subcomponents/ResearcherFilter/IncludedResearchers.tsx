import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex, Icon, Text, Avatar } from "@chakra-ui/react";
import { addedResearchersMock } from "../../../../../../../mocks/addedResearchers";
import { useState } from "react";

export default function IncludedResearchers() {
  const [addedResearchers, setAddedResearchers] = useState(addedResearchersMock);
  return (
    <>
    {addedResearchers.map((researcher) => (
      <Flex align="center" gap={5} px={4} py={2} borderWidth="1px" borderColor="gray.200" borderRadius="md">
        <Avatar size="sm" name={researcher.name} />
        <Flex align="center" justify="space-between" flex="1">
          <Text>{researcher.name} - {researcher.email}</Text>
          <Flex align="center" gap={8}>
            {researcher.status == "pending" && (<Text color="gray.500">Pending</Text>)}
            {researcher.status == "included" && (<Text>role: {researcher.role}</Text>)}
            <Icon as={DeleteIcon} w="15px" h="15px" color="gray.500" />
          </Flex> 
        </Flex>
      </Flex>
    ))}
    </>
  );
}
