// External Libraries
import { useTranslation } from "react-i18next";

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import AddSelectionTable from "../../components/common/inputs/selection/AddSelectionTable";
import ProtocolFormLayout from "../../components/common/protocolForm";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";
import { Box } from "@chakra-ui/react";

export default function InformationSourcesAndSearchStrategy() {
  const {
    informationSourcesAndSearchStrategy,
    handleChangeInformationSourcesAndSearchStrategy,
    syncAndNavigate,
  } = useCreateProtocol();

  const { t } = useTranslation("review/planning-protocol");
  const { searchMethod, searchString, sourcesSelectionCriteria } =
    informationSourcesAndSearchStrategy;
  const id = localStorage.getItem("systematicReviewId");

  return (
    <ProtocolFormLayout
      headerText={t("informationSourcesAndSearchStrategy.headerText")}
      navButtons={
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/eligibility-criteria/${id}`,
              )
            }
            text={t("informationSourcesAndSearchStrategy.navButton.back")}
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/selection-and-extraction/${id}`,
              )
            }
            text={t("informationSourcesAndSearchStrategy.navButton.next")}
          />
        </>
      }
    >
      <Box>
        <TextAreaInput
          value={sourcesSelectionCriteria}
          onChange={(event) => {
            handleChangeInformationSourcesAndSearchStrategy(
              "sourcesSelectionCriteria",
              event.target.value,
            );
          }}
          label={t("informationSourcesAndSearchStrategy.input.sourcesSelectionCriteria.label")}
          placeholder={t("informationSourcesAndSearchStrategy.input.sourcesSelectionCriteria.placeholder")}
        />
        <AddSelectionTable
          label={t("informationSourcesAndSearchStrategy.input.databasesAndInformationSource.label")}
          options={[
            "ACM Digital Library",
            "Backward Snowballing",
            "BDTD",
            "Cochrane Library",
            "Expert Suggestion",
            "Forward Snowballing",
            "Google Scholar",
            "Grey Literature Sources",
            "IEEE Xplore",
            "LILACS",
            "MEDLINE",
            "PubMed",
            "SciELO",
            "ScienceDirect",
            "Scopus",
            "SpringerLink",
            "Web of Science",
          ]}
          placeholder={t("informationSourcesAndSearchStrategy.input.databasesAndInformationSource.placeholder")}
          typeField="select"
        />
        <TextAreaInput
          value={searchMethod}
          onChange={(event) => {
            handleChangeInformationSourcesAndSearchStrategy(
              "searchMethod",
              event.target.value,
            );
          }}
          label={t("informationSourcesAndSearchStrategy.input.searchMethod.label")}
          placeholder={t("informationSourcesAndSearchStrategy.input.searchMethod.placeholder")}
        />
        <AddTextTable
          text={t("informationSourcesAndSearchStrategy.input.keywords.label")}
          placeholder={t("informationSourcesAndSearchStrategy.input.keywords.placeholder")}
          enableReferenceCode={false}
        />
        <TextAreaInput
          value={searchString}
          onChange={(event) => {
            handleChangeInformationSourcesAndSearchStrategy(
              "searchString",
              event.target.value,
            );
          }}
          label={t("informationSourcesAndSearchStrategy.input.searchString.label")}
          placeholder={t("informationSourcesAndSearchStrategy.input.searchString.placeholder")}
        />
      </Box>
    </ProtocolFormLayout>
  );
}
