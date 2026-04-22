// External Libraries
import { useTranslation } from "react-i18next";

// Components
import InputText from "@components/common/inputs/InputText";
import NavButton from "@components/common/buttons/NavigationButton";
import InputTextArea from "@components/common/inputs/InputTextArea";
import AlertInputText from "@components/common/inputs/AlertInputText";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Pages component
import ResearcherFilter from "./subcomponents/ResearcherFilter";

// Service
import useCreateReview from "../../services/useStructureReview";

export default function GeneralDefinition() {
  const {
    generalDefinition,
    handleChangeGeneralDefinition,
    handlePost,
    handlePut,
    isReturn,
    isTitleValid,
    isDescriptionValid,
    isObjectivesValid,
  } = useCreateReview();

  const { t } = useTranslation("review/planning-protocol"); 

  const { title, description, objectives } = generalDefinition;

  const isFormComplete = isTitleValid && isDescriptionValid && isObjectivesValid;

  return (
    <ProtocolFormLayout
      headerText={t("generalDefinition.headerText")}
      navButtons={
        <>
          {!isReturn ? (
            <NavButton
              event={handlePost}
              text={t("generalDefinition.navButtonText.create")}
              isDisabled={!isFormComplete}
            />
          ) : (
            <NavButton
              event={handlePut}
              text={t("generalDefinition.navButtonText.next")}
              isDisabled={!isFormComplete}
            />
          )}
        </>
      }
    >
      {isTitleValid ? (
        <InputText
          value={title}
          label={t("generalDefinition.input.title.label")}
          placeholder={t("generalDefinition.input.title.placeholder")}
          type="text"
          nome="text"
          onChange={(event) =>
            handleChangeGeneralDefinition("title", event.target.value)
          }
          labelAbove={true}
        />
      ) : (
        <AlertInputText
          border="red"
          value={title}
          label="Title is required"
          placeholder="Enter review title"
          type="text"
          nome="text"
          onChange={(event) =>
            handleChangeGeneralDefinition("title", event.target.value)
          }
          labelAbove={true}
        />
      )}

      {/* CAMPO: DESCRIPTION */}
      {isDescriptionValid ? (
        <InputTextArea
          value={description}
          label={t("generalDefinition.input.description.label")}
          placeholder={t("generalDefinition.input.description.placeholder")}
          onChange={(event) =>
            handleChangeGeneralDefinition("description", event.target.value)
          }
        />
      ) : (
        <AlertInputText
          border="red"
          value={description}
          label="Description is required"
          placeholder="Enter review description"
          type="text"
          nome="text"
          onChange={(event) =>
            handleChangeGeneralDefinition("description", event.target.value)
          }
          labelAbove={true}
        />
      )}

      {/* CAMPO: OBJECTIVES */}
      {isObjectivesValid ? (
        <InputTextArea
          value={objectives}
          label={t("generalDefinition.input.objectives.label")}
          placeholder={t("generalDefinition.input.objectives.placeholder")}
          onChange={(event) =>
            handleChangeGeneralDefinition("objectives", event.target.value)
          }
        />
      ) : (
        <AlertInputText
          border="red"
          value={objectives}
          label="Objectives are required"
          placeholder="What are your goals?"
          type="text"
          nome="text"
          onChange={(event) =>
            handleChangeGeneralDefinition("objectives", event.target.value)
          }
          labelAbove={true}
        />
      )}

      <ResearcherFilter />
    </ProtocolFormLayout>
  );
}
