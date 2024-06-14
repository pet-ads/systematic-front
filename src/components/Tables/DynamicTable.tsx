import TableRow from "./Subcomponents/TableRow";
import useTableSorting from "../../hooks/useTableSorting";
import useColumnVisibility from "../../hooks/useColumnVisibility";
import { tbConteiner } from "./styles/DynamicTableStyle";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Box } from "@chakra-ui/react";
import { StudyInterface } from "../../../public/interfaces/IStudy";
import { TableHeadersInterface } from "../../../public/interfaces/ITableHeaders";
import { KeywordInterface } from "../../../public/interfaces/KeywordInterface";
import { KeyWordHeaderInterface } from "../../../public/interfaces/IKeyWordHeard";
import { useContext } from "react";
import AppContext from "../Context/AppContext";

interface DynamicTableProps {
  headerData: TableHeadersInterface | KeyWordHeaderInterface;
  bodyData: (StudyInterface | KeywordInterface)[];
  tableType: string;
  filteredColumns: string[];
  selectedStatus: string | null;
}

enum tableTypeEnum {
  SELECTION = "selection",
  EXTRACTION = "extraction",
  KEYWORD = "keyword"
}


export default function DynamicTable({ headerData, bodyData, tableType, filteredColumns, selectedStatus }: DynamicTableProps) {
  const isKeyWordTable = tableType == tableTypeEnum.KEYWORD;
  const isSelectionTable = tableType == tableTypeEnum.SELECTION;
  const isExtractionTable = tableType === tableTypeEnum.EXTRACTION;
  
  const context = useContext(AppContext);

  const getColumnVisibility = useColumnVisibility(filteredColumns);
  const { handleSort, sortedData } = useTableSorting(bodyData, headerData);

  context?.setSortedStudies((sortedData as StudyInterface[]));

  const tableBuilder = (rowData, rowIndex) => {
    return (
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
              isSelectionTable = {isSelectionTable}
              isExtractionTable = {isExtractionTable}

            />
    )
  }

  const typeCheck = (rowData, selected) =>{
    if(isSelectionTable){
      return rowData.selectionStatus === selected;
    }
    else if(isExtractionTable){
      return rowData.extractionStatus === selected;
    }
    else return true;
  }

  return (
    <TableContainer sx={tbConteiner} h={isKeyWordTable ? 300 : 250} borderBottom={"1em solid #303D50"}>
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
                display={getColumnVisibility(header.toLowerCase()) ? "none" : ""}
                textAlign={"center"}
                color={"#FDF0D5"}
              >
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {selectedStatus? sortedData.map((rowData, rowIndex) => (
            typeCheck(rowData, selectedStatus.toUpperCase())?
            tableBuilder(rowData, rowIndex): <TableContainer></TableContainer>
          )):
          sortedData.map((rowData, rowIndex) => (
            tableBuilder(rowData, rowIndex)
          ))
          }
        </Tbody>
      </Table>
    </TableContainer>
  );
}
