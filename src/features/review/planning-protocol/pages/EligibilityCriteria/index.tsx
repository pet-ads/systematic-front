// External Libraries
import { useTranslation } from "react-i18next";

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import AddSelectionTable from "../../components/common/inputs/selection/AddSelectionTable";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";
import { Box } from "@chakra-ui/react";

const Languages = [
  "Arabic",
  "Bengali",
  "Chinese",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Finnish",
  "French",
  "German",
  "Greek",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Indonesian",
  "Italian",
  "Japanese",
  "Korean",
  "Norwegian",
  "Persian",
  "Polish",
  "Portuguese",
  "Romanian",
  "Russian",
  "Spanish",
  "Swedish",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Vietnamese",
].sort();

export default function EligibilityCriteria() {
  const {
    eligibilityCriteria,
    handleChangeEligibilityCriteria,
    syncAndNavigate,
  } = useCreateProtocol();

  const { t } = useTranslation("review/planning-protocol");
  const { studyTypeDefinition } = eligibilityCriteria;
  const id = localStorage.getItem("systematicReviewId");

  return (
    <ProtocolFormLayout
      headerText={t("eligibilityCriteria.headerText")}
      navButtons={
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/research-questions/${id}`,
              )
            }
            text={t("eligibilityCriteria.navButton.back")}
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/information-sources-and-search-strategy/${id}`,
              )
            }
            text={t("eligibilityCriteria.navButton.next")}
          />
        </>
      }
    >
      <Box>
        <AddTextTable
          text={t("eligibilityCriteria.input.inclusionCriteria.label")}
          placeholder={t(
            "eligibilityCriteria.input.inclusionCriteria.placeholder",
          )}
          referencePrefix="IC"
          enableReferenceCode={true}
        />
        <AddTextTable
          text={t("eligibilityCriteria.input.exclusionCriteria.label")}
          placeholder={t(
            "eligibilityCriteria.input.exclusionCriteria.placeholder",
          )}
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
          label={t("eligibilityCriteria.input.studyTypeDefinition.label")}
          placeholder={t(
            "eligibilityCriteria.input.studyTypeDefinition.placeholder",
          )}
        />
        <AddSelectionTable
          label={t("eligibilityCriteria.input.languages.label")}
          options={Languages}
          placeholder={t("eligibilityCriteria.input.languages.placeholder")}
          typeField="select"
          stateKey="Languages" // <-- String exata do código dev
        />
      </Box>
    </ProtocolFormLayout>
  );
}
