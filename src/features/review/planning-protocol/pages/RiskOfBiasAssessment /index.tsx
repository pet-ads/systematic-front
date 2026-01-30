// External library
import { Box } from "@chakra-ui/react";

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import InteractiveTable from "@features/review/planning-protocol/components/common/tables/InteractiveTable";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Hooks
import useCreateProtocol from "../../services/useCreateProtocol";

export default function RiskOfBiasAssessment() {
  const id = localStorage.getItem("systematicReviewId") || "";

  const url = `systematic-study/${id}/protocol`;

  const { syncAndNavigate } = useCreateProtocol();

  return (
    <ProtocolFormLayout
      headerText="Protocol: Risk of Bias Assessment"
      navButtons={
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/selection-and-extraction/${id}`
              )
            }
            text="Back"
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/analysis-and-synthesis-of-results/${id}`
              )
            }
            text="Next"
          />
        </>
      }
    >
      <Box>
        <InteractiveTable id={id} url={url} label={"Risk of Bias Questions"} />
      </Box>
    </ProtocolFormLayout>
  );
}
