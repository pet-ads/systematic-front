import { Box, Text } from "@chakra-ui/react";
import Header from "../../../../../components/structure/Header/Header";

import {
  barchartBox,
  conteiner,
  fluxogramaBox,
  graphicsconteiner,
  piechartBox,
  textDescription,
  textSection,
} from "./styles";
import FlexLayout from "../../../../../components/structure/Flex/Flex";

import { IncludedStudiesTable } from "../../components/tables/IncludedStudiesTable";
import CriteriaBarChart from "./subcomponents/CriteriaBarChart";
import StudiesFunnelChart from "./subcomponents/StudiesFunnelChart";
import { IncludedStudiesLineChart } from "./subcomponents/IncludedStudiesLineChart";
import { QuestionsCharts } from "./subcomponents/QuestionsCharts";
import DinamicChart from "../../components/charts/DinamicChart";
import { SearchSorcesTable } from "../../components/tables/SearchSoucesTable";

export default function Graphics() {
  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Graphics" />
      <Box sx={conteiner}>
        {/* SEÇÃO:GENERAL INFORMATION*/}
        <Box>
          <Text sx={textSection}>General Information</Text>

          {/* Serach sources*/}
          <Text sx={textDescription}>Search Sources</Text>
          <Box sx={graphicsconteiner}>
            <Box sx={piechartBox}>
              <DinamicChart />
            </Box>
            <SearchSorcesTable />
          </Box>

          {/*First Selection*/}
          <Text sx={textDescription}>First Selection</Text>
          <Box sx={graphicsconteiner}>
            <Box sx={barchartBox}>
              <CriteriaBarChart criteria="inclusion" stage="selection" />
            </Box>
            <Box sx={barchartBox}>
              <CriteriaBarChart criteria="exclusion" stage="selection" />
            </Box>
          </Box>

          {/*Second Selection*/}
          <Text sx={textDescription}>Second Selection</Text>
          <Box sx={graphicsconteiner}>
            <Box sx={barchartBox}>
              <CriteriaBarChart criteria="inclusion" stage="extraction" />
            </Box>
            <Box sx={barchartBox}>
              <CriteriaBarChart criteria="exclusion" stage="extraction" />
            </Box>
          </Box>

          {/*Funnel*/}
          <Text sx={textDescription}>Studies Funnel</Text>
          <Box sx={graphicsconteiner}>
            <Box sx={fluxogramaBox}>
              <StudiesFunnelChart />
            </Box>
          </Box>

          {/*included studies*/}
          <Text sx={textDescription}>Included Studies</Text>
          <Box sx={graphicsconteiner}>
            <IncludedStudiesTable />
            <IncludedStudiesLineChart />
          </Box>
        </Box>

        {/* SEÇÃO:FORM QUESTIONS*/}

        <Text sx={textSection}>Form Questions</Text>
        <QuestionsCharts />
      </Box>
    </FlexLayout>
  );
}
