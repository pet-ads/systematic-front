// Components
import NavButton from "@components/common/buttons/NavigationButton";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import AddSelectionTable from "../../components/common/inputs/selection/AddSelectionTable";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";
import { Box } from "@chakra-ui/react";

const Languages = ["Arabic", "Bengali", "Chinese", "Czech", "Danish", "Dutch", "English",
  "Finnish", "French", "German", "Greek", "Hebrew", "Hindi", "Hungarian", "Indonesian",
  "Italian", "Japanese", "Korean", "Norwegian", "Persian", "Polish", "Portuguese",
  "Romanian", "Russian", "Spanish", "Swedish", "Thai", "Turkish", "Ukrainian", "Vietnamese"].sort();

export default function EligibilityCriteria() {
  const {
    eligibilityCriteria,
    handleChangeEligibilityCriteria,
    syncAndNavigate,
  } = useCreateProtocol();

  const { studyTypeDefinition } = eligibilityCriteria;
  const id = localStorage.getItem("systematicReviewId");

  return (
    <ProtocolFormLayout
      headerText="Protocol: Eligibility Criteria"
      navButtons={
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/research-questions/${id}`,
              )
            }
            text="Back"
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/information-sources-and-search-strategy/${id}`,
              )
            }
            text="Next"
          />
        </>
      }
    >
      <Box>
        <AddTextTable
          text="Inclusion criteria"
          placeholder="Enter the criteria"
          referencePrefix="IC"
          enableReferenceCode={true}
        />
        <AddTextTable
          text="Exclusion criteria"
          placeholder="Enter the criteria"
          referencePrefix="EC"
          enableReferenceCode={true}
        />
        <TextAreaInput
          value={studyTypeDefinition}
          onChange={(event) => {
            handleChangeEligibilityCriteria(
              "studyTypeDefinition",
              event.target.value,
            );
          }}
          label="Study Type Definition"
          placeholder="Enter the study type definition"
        />
        <AddSelectionTable
          label="Languages"
          options={Languages}
          placeholder="Select language"
          typeField="select"
        />
      </Box>
    </ProtocolFormLayout>
  );
}
