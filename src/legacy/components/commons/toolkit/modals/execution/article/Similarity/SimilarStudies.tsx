import { Container, Box, Heading } from "@chakra-ui/react";
import DynamicTable from "../../../../tables/execution/DynamicTable/DynamicTable";
import useFetchTableData from "../../../../../../../hooks/execution/useFetchStudyData";
import useInputState from "../../../../../../../../hooks/useInputState";

import { NoStudiesData } from "../../../../../../../../components/NotFound/NoStudiesData";
import { tableTypeEnum } from "../../../../../../../../types/enums/tableTypeEnum";
import { TableHeadersInterface } from "../../../../../../../../types/ITableHeaders";

export default function SimilarStudies() {
  const studies = useFetchTableData("/data/NewStudyData.json");
  const headerData: TableHeadersInterface = {
    title: "Title",
    authors: "Author",
    year: "Year",
    selectionStatus: "Status/Selection",
    extractionStatus: "Status/Extraction",
    readingPriority: "Reading Priority",
  };
  const { value: checkedValues } = useInputState<string[]>([]);

  if (!studies) return <NoStudiesData />;

  return (
    <Container>
      <Heading textAlign="right" mx="2em">
        Similar Studies
      </Heading>

      <Box style={{ maxHeight: "350px", overflowY: "auto" }} w="39rem">
        <DynamicTable
          headerData={headerData}
          tableType={tableTypeEnum.MODAL}
          bodyData={studies}
          filteredColumns={checkedValues}
          searchString={""}
          selectedStatus={null}
        />
      </Box>
    </Container>
  );
}
