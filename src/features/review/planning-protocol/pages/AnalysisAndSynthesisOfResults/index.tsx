// External Libraries
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "@features/shared/context/ApplicationContext";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function AnalysisAndSynthesisOfResults() {
  const windowWidth = useWindowWidth();
  const context = useContext(AppContext);
  if(!context) return null;
  const { sidebarState, setSidebarState } = context;
  useEffect(() => {
    if(windowWidth < 1000 && sidebarState === "open") setSidebarState("collapsed");
  }, []);

  const {
    analysisAndSynthesisOfResults,
    handleChangeAnalysisAndSynthesisOfResults,
    syncAndNavigate,
  } = useCreateProtocol();

  const { analysisAndSynthesisProcess } = analysisAndSynthesisOfResults;

  const id = localStorage.getItem("systematicReviewId") || "";

  const { t } = useTranslation("review/planning-protocol");

  return (
    <ProtocolFormLayout
      headerText={t("analysisAndSynthesisOfResults.headerText")}
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/risk-of-bias-assessment/${id}`
              )
            }
            text={t("analysisAndSynthesisOfResults.navButton.back")}
          />
          <NavButton
            event={() => syncAndNavigate("/review/execution/identification")}
            text={t("analysisAndSynthesisOfResults.navButton.next")}
          />
        </>
      )}
    >
      <TextAreaInput
        value={analysisAndSynthesisProcess}
        label={t("analysisAndSynthesisOfResults.input.analysisAndSynthesisProcess.label")}
        placeholder={t("analysisAndSynthesisOfResults.input.analysisAndSynthesisProcess.placeholder")}
        onChange={(event) =>
          handleChangeAnalysisAndSynthesisOfResults(
            "analysisAndSynthesisProcess",
            event.target.value
          )
        }
      />
    </ProtocolFormLayout>
  );
}
