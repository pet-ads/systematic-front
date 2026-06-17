// External Libraries
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "@features/shared/context/ApplicationContext";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import { Box } from "@chakra-ui/react"; // Adicionado o Box

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import InteractiveTable from "@features/review/planning-protocol/components/common/tables/InteractiveTable";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";
import ProtocolFormLayout from "../../components/common/protocolForm";

export default function SelectionAndExtraction() {
  const windowWidth = useWindowWidth();
  const context = useContext(AppContext);
  
  const {
    selectionAndExtraction,
    handleChangeSelectionAndExtraction,
    syncAndNavigate,
  } = useCreateProtocol();

  const { t } = useTranslation("review/planning-protocol");
  
  useEffect(() => {
    if(context && windowWidth < 1000 && context.sidebarState === "open") {
      context.setSidebarState("collapsed");
    }
  }, [windowWidth]);

  if(!context) return null;

  const { dataCollectionProcess, selectionProcess } = selectionAndExtraction;

  const id = localStorage.getItem("systematicReviewId") || "";
  const url = `systematic-study/${id}/protocol`;

  return (
    <ProtocolFormLayout
      headerText={t("selectionAndExtraction.headerText")}
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/information-sources-and-search-strategy/${id}`
              )
            }
            text={t("selectionAndExtraction.navButton.back")}
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/risk-of-bias-assessment/${id}`
              )
            }
            text={t("selectionAndExtraction.navButton.next")}
          />
        </>
      )}
    >
      <Box 
        display="flex" 
        flexDirection="column" 
        w="100%"
        gap="2rem"
        sx={{
          "& > *": {
            width: "100%",
            maxWidth: "100%",
          }
        }}
      >
        <TextAreaInput
          value={selectionProcess}
          onChange={(event) => {
            handleChangeSelectionAndExtraction(
              "selectionProcess",
              event.target.value
            );
          }}
          label={t("selectionAndExtraction.input.selectionProcess.label")}
          placeholder={t("selectionAndExtraction.input.selectionProcess.placeholder")}
        />
        <TextAreaInput
          value={dataCollectionProcess}
          onChange={(event) => {
            handleChangeSelectionAndExtraction(
              "dataCollectionProcess",
              event.target.value
            );
          }}
          label={t("selectionAndExtraction.input.dataCollectionProcess.label")}
          placeholder={t("selectionAndExtraction.input.dataCollectionProcess.placeholder")}
        />
        <InteractiveTable id={id} url={url} label={t("selectionAndExtraction.input.extractionQuestions.label")} />
      </Box>
    </ProtocolFormLayout>
  );
}