import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { TbArticleOff } from "react-icons/tb";

export default function NoDataMessage() {
  return (
    <Box px={{ base: "1rem", md: "2rem" }} w="100%" h="100%">
      <Flex
        mt="4rem"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        gap="0.75rem"
        p="2rem"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        bg="gray.50"
        h="calc(100% - 1rem)" 
      >
        <TbArticleOff size="2.5rem" color="#A0AEC0" />
        
        <VStack spacing={1}>
          <Text fontSize="md" fontWeight="bold" color="gray.800">
            No Articles Found
          </Text>
          <Text fontSize="sm" color="gray.600">
            Try adjusting your filters or check back later.
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}