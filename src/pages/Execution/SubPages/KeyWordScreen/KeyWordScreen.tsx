import Header from "../../../../components/ui/Header/Header";
import DynamicTable from "../../../../components/Tables/DynamicTable";
import useFetchTableData from "../../../../hooks/fetch/useFetchTableData";
import { Flex } from "@chakra-ui/react";
import GridLayout from "../../../../components/ui/Grid/Grid";

export default function KeyWordScreen() {
  const { headerData, bodyData } = useFetchTableData("/data/keywordData.json");
  return (
    <GridLayout defaultOpen={1} navigationType="Accordion">
      <Header text="Keyword Screen" />

      <Flex marginLeft={"4em"} marginRight={"4em"}>
        <DynamicTable headerData={headerData} bodyData={bodyData} type="keyword" filteredColumns={[]} />
      </Flex>
    </GridLayout>
  );
}
