import { Text, VStack } from "@chakra-ui/react";
import AddResearcher from "./AddResearcher";
import IncludedResearchers from "./IncludedResearchers";

export default function ResearcherFilter() {
  return (
    <>
      <Text mt={"30px"} fontWeight={500} fontSize={"large"}>Researchers</Text>

      <VStack spacing={0} align="stretch" border="2px solid" borderColor="gray.300" borderRadius="md" bgColor="#ffffffff" px={2} py={2}>
        <AddResearcher />
        <IncludedResearchers />
      </VStack>
    </>
  );
}
