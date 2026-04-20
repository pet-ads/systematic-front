// External library
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// Components
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";
import useProtocolAccordion from "../../services/useProtocolAccordion";
import ProtocolFormLayout from "../../components/common/protocolForm";

export default function ResearchQuestions() {
  const { researchQuestion, handleChangeResearchQuestion, syncAndNavigate } =
    useCreateProtocol();

  const { t } = useTranslation("review/planning-protocol");

  const { showResearchQuestions } = useProtocolAccordion();

  const { justification } = researchQuestion;

  const id = localStorage.getItem("systematicReviewId");

  return (
    <ProtocolFormLayout
      headerText={t("researchQuestions.headerText")}
      formControlProps={{ gap: 1.5 }} 
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate(`/review/planning/protocol/picoc/${id}`)
            }
            text={t("researchQuestions.navButton.back")}
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/eligibility-criteria/${id}`
              )
            }
            text={t("researchQuestions.navButton.next")}
          />
        </>
      )}
    >
      <TextAreaInput
        value={justification}
        label={t("researchQuestions.primaryQuestion.label")}
        placeholder={t("researchQuestions.primaryQuestion.placeholder")}
        onChange={(event) =>
          handleChangeResearchQuestion("justification", event.target.value)
        }
      />

      <Accordion
        defaultIndex={showResearchQuestions ? [0] : [-1]}
        allowToggle
        mt={6}
        w={"60vw"}
      >
        <AccordionItem>
          <h2 style={{ color: "#2E4B6C" }}>
            <AccordionButton>
              <Box flex="1" textAlign="center">
                <Heading size="md">{t("researchQuestions.secondaryQuestions.heading")}</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex>
              <AddTextTable
                text={t("researchQuestions.secondaryQuestions.label")}
                placeholder={t("researchQuestions.secondaryQuestions.placeholder")}
                referencePrefix="RQ"
                enableReferenceCode={true}
              />
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </ProtocolFormLayout>
  );
}
