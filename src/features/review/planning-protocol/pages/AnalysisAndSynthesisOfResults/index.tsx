// Components
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function AnalysisAndSynthesisOfResults() {
  const {
    analysisAndSynthesisOfResults,
    handleChangeAnalysisAndSynthesisOfResults,
    syncAndNavigate,
  } = useCreateProtocol();

  const { analysisAndSynthesisProcess } = analysisAndSynthesisOfResults;

  const id = localStorage.getItem("systematicReviewId") || "";

  return (
    <ProtocolFormLayout
      headerText="Protocol: Analysis and Synthesis of Results"
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/risk-of-bias-assessment/${id}`
              )
            }
            text="Back"
          />
          <NavButton
            event={() => syncAndNavigate("/review/execution/identification")}
            text="Next"
          />
        </>
      )}
    >
      <TextAreaInput
        value={analysisAndSynthesisProcess}
        label="Analysis and Synthesis Method"
        placeholder="Enter your Analysis and Synthesis Method"
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
