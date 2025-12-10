// Components
import NavButton from "@components/common/buttons/NavigationButton";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import AddSelectionTable from "../../components/common/inputs/selection/AddSelectionTable";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";
import { Box } from "@chakra-ui/react";

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
    <ProtocolFormLayout
      headerText="Protocol: Information Sources And Search Strategy"
      navButtons={
        <>
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
        </>
      }
    >
      <Box>
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
        <AddTextTable
          text="Keywords"
          placeholder="Enter the keywords related to your review"
          enableReferenceCode={false}
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
        />
      </Box>
    </ProtocolFormLayout>
  );
}
