// External library
import { useContext, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import AppContext from "@features/shared/context/ApplicationContext";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import InteractiveTable from "@features/review/planning-protocol/components/common/tables/InteractiveTable";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Hooks
import useCreateProtocol from "../../services/useCreateProtocol";

export default function RiskOfBiasAssessment() {
  const windowWidth = useWindowWidth();
  const context = useContext(AppContext);
  if(!context) return null;
  const { sidebarState, setSidebarState } = context;
  useEffect(() => {
    if(windowWidth < 1000 && sidebarState === "open") setSidebarState("collapsed");
  }, []);

  const id = localStorage.getItem("systematicReviewId") || "";

  const url = `systematic-study/${id}/protocol`;

  const { syncAndNavigate } = useCreateProtocol();

  const { t } = useTranslation("review/planning-protocol");

  return (
    <ProtocolFormLayout
      headerText={t("riskOfBiasAssessment.headerText")}
      navButtons={
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/collaboration/${id}`
              )
            }
            text={t("riskOfBiasAssessment.navButton.back")}
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/analysis-and-synthesis-of-results/${id}`
              )
            }
            text={t("riskOfBiasAssessment.navButton.next")}
          />
        </>
      }
    >
      <Box>
        <InteractiveTable id={id} url={url} label={t("riskOfBiasAssessment.input.riskOfBiasQuestions.label")} />
      </Box>
    </ProtocolFormLayout>
  );
}
