// Components
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function Picoc() {
  const { picoc, handleChangePicoc, syncAndNavigate } = useCreateProtocol();

  const id = localStorage.getItem("systematicReviewId");
  const { population, intervention, control, outcome, context } = picoc;

return (
    <ProtocolFormLayout
      headerText="Protocol: PICOC"
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate("/review/planning/protocol/general-definition")
            }
            text="Back"
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/research-questions/${id}`
              )
            }
            text="Next"
          />
        </>
      )}
    >
      <TextAreaInput
        value={population}
        label="Population"
        placeholder="What is your study population?"
        onChange={(event) => {
          handleChangePicoc("population", event.target.value);
        }}
      />
      <TextAreaInput
        value={intervention}
        label="Intervention"
        placeholder="What is your intervention?"
        onChange={(event) => {
          handleChangePicoc("intervention", event.target.value);
        }}
      />
      <TextAreaInput
        value={control}
        label="Control"
        placeholder="What is your control?"
        onChange={(event) => {
          handleChangePicoc("control", event.target.value);
        }}
      />
      <TextAreaInput
        value={outcome}
        label="Outcome"
        placeholder="What is your outcome?"
        onChange={(event) => {
          handleChangePicoc("outcome", event.target.value);
        }}
      />
      <TextAreaInput
        value={context}
        label="Context"
        placeholder="What is your context?"
        onChange={(event) => {
          handleChangePicoc("context", event.target.value);
        }}
      />
    </ProtocolFormLayout>
  );
}
