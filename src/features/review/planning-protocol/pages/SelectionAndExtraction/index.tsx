// Components
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import InteractiveTable from "@features/review/planning-protocol/components/common/tables/InteractiveTable";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";
import ProtocolFormLayout from "../../components/common/protocolForm";

export default function SelectionAndExtraction() {
  const {
    selectionAndExtraction,
    handleChangeSelectionAndExtraction,
    syncAndNavigate,
  } = useCreateProtocol();

  const { dataCollectionProcess, selectionProcess } = selectionAndExtraction;

  const id = localStorage.getItem("systematicReviewId") || "";
  const url = `systematic-study/${id}/protocol`;

  return (
    <ProtocolFormLayout
      headerText="Protocol: Selection and Extraction"
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/information-sources-and-search-strategy/${id}`
              )
            }
            text="Back"
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/risk-of-bias-assessment/${id}`
              )
            }
            text="Next"
          />
        </>
      )}
    >
      <TextAreaInput
        value={selectionProcess}
        onChange={(event) => {
          handleChangeSelectionAndExtraction(
            "selectionProcess",
            event.target.value
          );
        }}
        label="Study Selection Process"
        placeholder="Enter selection process"
      />
      <TextAreaInput
        value={dataCollectionProcess}
        onChange={(event) => {
          handleChangeSelectionAndExtraction(
            "dataCollectionProcess",
            event.target.value
          );
        }}
        label="Data Collection Process"
        placeholder="Enter the data colletion process"
      />
      <InteractiveTable id={id} url={url} label={"Extraction Questions"} />
    </ProtocolFormLayout>
  );
}
