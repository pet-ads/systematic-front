// External library
import { Table, TableContainer, Thead, Tr, Tbody, Th } from "@chakra-ui/react";
import { ReportTd } from "../subcomponents/row/ReportTd";

type DataTextQuestions = Record<string, number[]>;

type QuestionsTableProps = {
  data: DataTextQuestions;
};

export const QuestionsTable = ({ data }: QuestionsTableProps) => {
  const columns = [
    { label: "Answer" },
    { label: "Studies",isNumeric:true},
    { label: "Total",isNumeric:true },
    {label: "Percentage of Total",isNumeric:true}
  ];

const totalResponses = Object.values(data).reduce((sum,ids)=>sum+ids.length,0);
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.label} isNumeric={column.isNumeric}>{column.label} </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(data).filter(([_, ids]) => ids.length > 0).map(([answerText, ids]) => (
            
            <Tr key={answerText} _hover={{ bg: "gray.300" }}>
              
              <ReportTd text={answerText}/>
              <ReportTd text={ids.join(", ")} type="number"/>
              <ReportTd text={ids.length.toString()} type="number"/>
              <ReportTd text={`${((ids.length/totalResponses)*100).toFixed(2)}%`} type="number"/>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
