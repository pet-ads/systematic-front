// External Libraries
import { useTranslation } from "react-i18next";

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function Picoc() {
  const { picoc, handleChangePicoc, syncAndNavigate } = useCreateProtocol();
  const { t } = useTranslation("review/planning-protocol");

  const id = localStorage.getItem("systematicReviewId");
  const { population, intervention, control, outcome, context } = picoc;

return (
    <ProtocolFormLayout
      headerText={t("picoc.headerText")}
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate("/review/planning/protocol/general-definition")
            }
            text={t("picoc.navButton.back")}
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/research-questions/${id}`
              )
            }
            text={t("picoc.navButton.next")}
          />
        </>
      )}
    >
      <TextAreaInput
        value={population}
        label={t("picoc.input.population.label")}
        placeholder={t("picoc.input.population.placeholder")}
        onChange={(event) => {
          handleChangePicoc("population", event.target.value);
        }}
      />
      <TextAreaInput
        value={intervention}
        label={t("picoc.input.intervention.label")}
        placeholder={t("picoc.input.intervention.placeholder")}
        onChange={(event) => {
          handleChangePicoc("intervention", event.target.value);
        }}
      />
      <TextAreaInput
        value={control}
        label={t("picoc.input.control.label")}
        placeholder={t("picoc.input.control.placeholder")}
        onChange={(event) => {
          handleChangePicoc("control", event.target.value);
        }}
      />
      <TextAreaInput
        value={outcome}
        label={t("picoc.input.outcome.label")}
        placeholder={t("picoc.input.outcome.placeholder")}
        onChange={(event) => {
          handleChangePicoc("outcome", event.target.value);
        }}
      />
      <TextAreaInput
        value={context}
        label={t("picoc.input.context.label")}
        placeholder={t("picoc.input.context.placeholder")}
        onChange={(event) => {
          handleChangePicoc("context", event.target.value);
        }}
      />
    </ProtocolFormLayout>
  );
}
