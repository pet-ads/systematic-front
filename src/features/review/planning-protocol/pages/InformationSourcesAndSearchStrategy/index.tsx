// External library
import { Box, FormControl } from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import AddSelectionTable from "../../components/common/inputs/selection/AddSelectionTable";
import FlexLayout from "@components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function InformationSourcesAndSearchStrategy() {
  const {
    informationSourcesAndSearchStrategy,
    handleChangeInformationSourcesAndSearchStrategy,
    syncAndNavigate,
  } = useCreateProtocol();

  const { searchMethod, searchString, sourcesSelectionCriteria } =
    informationSourcesAndSearchStrategy;
  const id = localStorage.getItem("systematicReviewId");

  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Protocol: Information Sources And Search Strategy" />
      <CardDefault backgroundColor="#fff"
          borderRadius="1rem"
          withShadow={false}>
        <FormControl
          m={"20px auto 0"}
          display={"flex"}
          gap={10}
          flexDir={"column"}
          w={"60vw"}
          alignItems={"center"}
        >
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
            isSectionTitle
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
            isSectionTitle
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
            isSectionTitle
          />
          <AddTextTable
            text="Keywords"
            placeholder="Enter the keywords related to your review"
            isSectionTitle
          />
          <TextAreaInput
            value={searchString}
            onChange={(event) => {
              handleChangeInformationSourcesAndSearchStrategy(
                "searchString",
                event.target.value
              );
            }}
            label="Search String"
            placeholder="Enter the search string"
            isSectionTitle
          />
          <Box
            w={"60vw"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"end"}
          >
            <NavButton
              event={() =>
                syncAndNavigate(
                  `/review/planning/protocol/eligibility-criteria/${id}`
                )
              }
              text="Back"
            />
            <NavButton
              event={() =>
                syncAndNavigate(
                  `/review/planning/protocol/selection-and-extraction/${id}`
                )
              }
              text="Next"
            />
          </Box>
        </FormControl>
      </CardDefault>
    </FlexLayout>
  );
}
