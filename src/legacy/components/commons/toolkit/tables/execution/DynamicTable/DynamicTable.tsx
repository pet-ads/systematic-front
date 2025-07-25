import TableRow from "./subcomponents/TableRow";
import useTableSorting from "../../../../../../hooks/execution/useTableSorting";
import useColumnVisibility from "../../../../../../hooks/execution/useColumnVisibility";
import { tbConteiner } from "../../../../../../../components/Tables/styles/DynamicTableStyle";
import { Table, TableContainer, Thead, Tbody, Tr, Th } from "@chakra-ui/react";

import { tableTypeEnum } from "../../../../../../../types/enums/tableTypeEnum";
import { TableHeadersInterface } from "../../../../../../../types/ITableHeaders";
import { StudyInterface } from "../../../../../../../types/IStudy";
import { KeywordInterface } from "../../../../../../../types/KeywordInterface";
import { KeyWordHeaderInterface } from "../../../../../../../types/IKeyWordHeard";
// import { useContext } from "react";
// import AppContext from "../Context/AppContext";

interface DynamicTableProps {
  headerData: TableHeadersInterface | KeyWordHeaderInterface;
  bodyData: (StudyInterface | KeywordInterface)[];
  tableType: tableTypeEnum;
  filteredColumns: string[];
  searchString?: string;
  selectedStatus?: string | null;
}

//searchString, selectedStatus
export default function DynamicTable({
  headerData,
  bodyData,
  tableType,
  filteredColumns,
}: DynamicTableProps) {
  const isKeyWordTable = tableType == tableTypeEnum.KEYWORD;
  const isSelectionTable = tableType == tableTypeEnum.SELECTION;
  const isExtractionTable = tableType === tableTypeEnum.EXTRACTION;
  //const studiesToFilter = (bodyData as StudyInterface[]);
  // const context = useContext(AppContext);

  const getColumnVisibility = useColumnVisibility(filteredColumns);
  // const filteredStudies = useStudiesFilter({studiesToFilter, searchString, tableType, selectedStatus})
  const { handleSort, sortedData } = useTableSorting(bodyData, headerData);

  // context?.setSortedStudies((sortedData as StudyInterface[]));

  return (
    <TableContainer
      sx={tbConteiner}
      h={isKeyWordTable ? 300 : 250}
      borderBottom={"1em solid #303D50"}
    >
      <Table variant={"striped"}>
        <Thead bgColor={"#303D50"}>
          <Tr>
            <Th></Th>
            {Object.values(headerData).map((header) => (
              <Th
                key={header}
                onClick={() => handleSort(header)}
                _hover={{ cursor: "pointer" }}
                id={header.toLowerCase()}
                display={
                  getColumnVisibility(header.toLowerCase()) ? "none" : ""
                }
                textAlign={"center"}
                color={"#FDF0D5"}
              >
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {sortedData.map((rowData, rowIndex) => (
            <TableRow
              rowData={rowData}
              rowIndex={rowIndex}
              isKeyWordTable={isKeyWordTable}
              getColumnVisibility={getColumnVisibility}
              headerData={headerData}
              title={""}
              status={"Accepted"}
              readingPriority={"Very high"}
              searchSession={"Scopus"}
              score={0}
              isSelectionTable={isSelectionTable}
              isExtractionTable={isExtractionTable}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
