import { useParams } from "react-router-dom";

import Header from "../../../components/ui/Header/Header";
import ArticlesTable from "../../../components/Tables/ArticlesTable/ArticlesTable";

import useGetSessionStudies from "../../../hooks/useGetSessionStudies";

import FlexLayout from "../../../components/ui/Flex/Flex";
import { Flex } from "@chakra-ui/react";

export default function IdentificationSession() {
  const { session = "" } = useParams();
  const { articles } = useGetSessionStudies(session);

  return (
    <FlexLayout defaultOpen={1} navigationType="Accordion">
      <Header text="Search Sessions" />
      <Flex
        justifyContent="center"
        alignItems="start"
        w="calc(100% - 2rem)"
        h="90vh"
      >
        <ArticlesTable articles={articles} page="Identification" />
      </Flex>
    </FlexLayout>
  );
}
