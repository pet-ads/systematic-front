// External Libraries
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "@features/shared/context/ApplicationContext";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import { Box } from "@chakra-ui/react";

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import AddSelectionTable from "../../components/common/inputs/selection/AddSelectionTable";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

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
  const windowWidth = useWindowWidth();
  const context = useContext(AppContext);
  
  const {
    eligibilityCriteria,
    handleChangeEligibilityCriteria,
    syncAndNavigate,
  } = useCreateProtocol();

  const { t } = useTranslation("review/planning-protocol");
  useEffect(() => {
    if (context && windowWidth < 1000 && context.sidebarState === "open") {
      context.setSidebarState("collapsed");
    }
  }, [windowWidth]);

  if (!context) return null;

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
      <Box 
        display="flex" 
        flexDirection="column" 
        gap="2rem" 
        w="100%"
        sx={{
          "& > *": {
            width: "100%",
            maxWidth: "100%",
          }
        }}
      >
        <AddTextTable
          text={t("eligibilityCriteria.input.inclusionCriteria.label")}
          contextId="Inclusion criteria"
          placeholder={t(
            "eligibilityCriteria.input.inclusionCriteria.placeholder",
          )}
          referencePrefix="IC"
          enableReferenceCode={true}
        />
        <AddTextTable
          text={t("eligibilityCriteria.input.exclusionCriteria.label")}
          contextId="Exclusion criteria" 
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
          stateKey="Languages"
        />
      </Box>
    </ProtocolFormLayout>
  );
}