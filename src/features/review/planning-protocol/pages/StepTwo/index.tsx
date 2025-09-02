// External library
import { Progress, FormControl, Box } from "@chakra-ui/react";

// Components
import Header from "../../../../../components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";
import AddSelectionTable from "../../components/common/inputs/selection/AddSelectionTable";
import FlexLayout from "../../../../../components/structure/Flex/Flex";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

// Styles
import { btnBox, conteiner, flex } from "./styles";

export default function ProtocolPartTwo2() {
  const {
    informationSourcesAndSearchStrategy,
    eligibilityCriteria,
    selectionAndExtraction,
    handleChangeSelectionAndExtraction,
    handleChangeEligibilityCriteria,
    handleChangeInformationSourcesAndSearchStrategy,
    syncAndNavigate,
  } = useCreateProtocol();

  const { searchMethod, searchString, sourcesSelectionCriteria } =
    informationSourcesAndSearchStrategy;
  const { studyTypeDefinition } = eligibilityCriteria;
  const { dataCollectionProcess, selectionProcess } = selectionAndExtraction;
  const id = localStorage.getItem("systematicReviewId") || "";

  return (
    <FlexLayout defaultOpen={0} navigationType="Accordion">
      <Box
        w={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Header text="Protocol" />
        <Progress value={66} w={"100%"} color={"black"} />

        <FormControl sx={conteiner}>
          <AddTextTable
            text="Inclusion criteria"
            placeholder="Enter the criteria"
          />

          <AddTextTable
            text="Exclusion criteria"
            placeholder="Enter the criteria"
          />

          <FormControl sx={flex}>
            <AddTextTable
              text="Keywords"
              placeholder="Enter the keywords related to your review"
            />
          </FormControl>

          <AddSelectionTable
            label="Languages"
            options={["ENGLISH", "PORTUGUESE", "FRENCH", "SPANISH", "GERMAN"]}
            placeholder={"Select language"}
            typeField="select"
          />

          <AddSelectionTable
            label="Databases and Information Source"
            options={[
              "Google Scholar",
              "Scopus",
              "Scielo",
              "BDTD",
              "PubMed",
              "Expert Suggestion",
              "Backward Snowballing",
              "Forward Snowballing",
              "Grey Literature Sources",
            ]}
            placeholder={"Select Data Base"}
            typeField="select"
          />

          <TextAreaInput
            value={searchString}
            onChange={(e) => {
              handleChangeInformationSourcesAndSearchStrategy(
                "searchString",
                e.target.value
              );
            }}
            label="Search String"
            placeholder="Enter the search string"
          />

          <TextAreaInput
            value={studyTypeDefinition}
            onChange={(e) => {
              handleChangeEligibilityCriteria(
                "studyTypeDefinition",
                e.target.value
              );
            }}
            label="Study Type Definition"
            placeholder="Enter the study type definition"
          />

          <TextAreaInput
            value={sourcesSelectionCriteria}
            onChange={(event) => {
              handleChangeInformationSourcesAndSearchStrategy(
                "sourcesSelectionCriteria",
                event.target.value
              );
            }}
            label="Sources Selection Criteria"
            placeholder="Enter the sources selection criteria"
          />

          <TextAreaInput
            value={searchMethod}
            onChange={(event) => {
              handleChangeInformationSourcesAndSearchStrategy(
                "searchMethod",
                event.target.value
              );
            }}
            label="Search Strategy"
            placeholder="Enter Search Strategy"
          />

          <TextAreaInput
            value={selectionProcess}
            onChange={(event) => {
              handleChangeSelectionAndExtraction(
                "selectionProcess",
                event.target.value
              );
            }}
            label="Study Selection Process"
            placeholder="Enter selection process"
          />

          <TextAreaInput
            value={dataCollectionProcess}
            onChange={(event) => {
              handleChangeSelectionAndExtraction(
                "dataCollectionProcess",
                event.target.value
              );
            }}
            label="Data Collection Process"
            placeholder="Enter the data colletion process"
          />
        </FormControl>

        <Box sx={btnBox}>
          <NavButton
            event={() =>
              syncAndNavigate(`/review/planning/protocol-part-I/${id}`)
            }
            text="Back"
          />
          <NavButton
            event={() =>
              syncAndNavigate(`/review/planning/protocol-part-III/${id}`)
            }
            text="Next"
          />
        </Box>
      </Box>
    </FlexLayout>
  );
}
