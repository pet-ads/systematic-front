import { Flex, Text } from "@chakra-ui/react";
import Header from "../../../../../components/structure/Header/Header";
import FlexLayout from "../../../../../components/structure/Flex/Flex";

export default function Finalization() {
  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Finalization" />
      <Flex h="50%" width="100%" align="end" justifyContent="center">
        <Text fontSize="6xl">Recurso em desenvolvimento! </Text>
      </Flex>
    </FlexLayout>
  );
}
