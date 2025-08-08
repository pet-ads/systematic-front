import { useParams } from "react-router-dom";

import Header from "../../../../../components/structure/Header/Header";

import useGetSessionStudies from "../../services/useGetSessionStudies";

import FlexLayout from "../../../../../components/structure/Flex/Flex";
import { Box } from "@chakra-ui/react";
import ArticlesTable from "@features/review/shared/components/common/tables/ArticlesTable";
import useVisibiltyColumns from "@features/review/shared/hooks/useVisibilityColumns";
import ColumnVisibilityMenu from "@features/review/shared/components/common/menu/ColumnVisibilityMenu";

export default function IdentificationSession() {
  const { session = "" } = useParams();
  const { articles } = useGetSessionStudies(session);

  const { columnsVisible, toggleColumnVisibility } = useVisibiltyColumns({
    page: "Identification",
  });

  return (
    <FlexLayout defaultOpen={1} navigationType="Accordion">
      <Header text="Search Sessions" />
      <Box
        justifyContent="center"
        alignItems="start"
        w="calc(100% - 2rem)"
        h="90vh"
      >
        <Box
          display="flex"
          gap="1rem"
          justifyContent="end"
          alignContent="center"
          width="100%"
          marginBottom="1.5rem"
        >
          <ColumnVisibilityMenu
            columnsVisible={columnsVisible}
            toggleColumnVisibility={toggleColumnVisibility}
          />
        </Box>
        <ArticlesTable articles={articles} columnsVisible={columnsVisible} />
      </Box>
    </FlexLayout>
  );
}
