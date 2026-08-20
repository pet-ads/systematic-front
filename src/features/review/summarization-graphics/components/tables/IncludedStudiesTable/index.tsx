
import { Table, TableContainer, Thead, Tr, Tbody, Th } from "@chakra-ui/react";


import useFetchInclusionCriteria from "../../../../shared/services/useFetchInclusionCriteria";

import { ReportTd } from "../subcomponents/row/ReportTd";

import type ArticleInterface from "../../../../shared/types/ArticleInterface";
import { StudyInterface } from "../../../../shared/types/IStudy";

type Column = {
  label: string;
};

type Props = {
  filteredStudies: (ArticleInterface | StudyInterface)[];
};

export const IncludedStudiesTable = ({filteredStudies}:Props) => {
  const columns: Column[] = [
    { label: "Id" },
    { label: "Title" },
    { label: "Author" },
    { label: "Year" },
    { label: "Venue" },
    { label: "Source" },
    { label: "IC" },
  ];


  const inclusionCriterias = useFetchInclusionCriteria();

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.label}>{column.label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {filteredStudies.map((study, index) => {
            const id =
              "studyReviewId" in study ? study.studyReviewId : index.toString();
            const sourceText =
              "searchSources" in study ? study.searchSources.join(", ") : "";
            const criteriaText =
              "criteria" in study
                ? study.extractionCriteria
                    .map((cr) => {
                      const idx = inclusionCriterias.findIndex(
                        (item) => item === cr
                      );
                      return `C${idx + 1} : ${cr}`;
                    })
                    .join(" , ")
                : "";

            return (
              <Tr key={id} _hover={{ bg: "gray.300" }}>
                <ReportTd text={id.toString()} />
                <ReportTd text={study.title} />
                <ReportTd text={study.authors} />
                <ReportTd text={study.year.toString()} />
                <ReportTd text={study.venue} />
                <ReportTd text={sourceText} />
                <ReportTd text={criteriaText} />
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
