import { useState, useContext, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box, Radio, RadioGroup, Stack, Flex, Accordion, AccordionButton, Heading, AccordionIcon, AccordionPanel, AccordionItem, Checkbox, Text, useToast } from "@chakra-ui/react";
import { BsPeopleFill } from "react-icons/bs";

import AppContext from "@features/shared/context/ApplicationContext";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

import ProtocolFormLayout from "../../components/common/protocolForm";
import CollaborationTable from "./subcomponents/CollaborationTable";
import NavButton from "@components/common/buttons/NavigationButton";

import useCreateProtocol from "../../services/useCreateProtocol";
import { getReviewMode, updateReviewMode } from "../../services/reviewModeService";

type Stage = "SELECTION" | "EXTRACTION";

interface StageConfig {
  stage: Stage;
  type: "replication" | "division";
  payload: Record<string, unknown>;
}

const buildStageBody = (config: StageConfig, acceptMajority: boolean) => {
  if (config.type === "replication") {
    return {
      stage: config.stage.toUpperCase(),
      replication: {
        mainReviewer: config.payload.mainReviewer,
        secondaryReviewers: config.payload.secondaryReviewers,
        noStudySharedBySecondaries: config.payload.noStudySharedBySecondaries,
        acceptMajority,
      },
    };
  }

  return {
    stage: config.stage.toUpperCase(),
    split: {
      reviewers: config.payload.reviewers,
      reviewPerStudy: config.payload.reviewPerStudy,
      acceptMajority,
    },
  };
};

const readStageMode = (data: any, stage: Stage): string => {
  const stageData = data?.[stage.toLowerCase()];
  if (stageData?.replication) return "replication";
  if (stageData?.split) return "division";
  return "";
};

export default function Collaboration() {
  const windowWidth = useWindowWidth();
  const appContext = useContext(AppContext);
  const toast = useToast();
  const { t } = useTranslation([
    "review/planning-protocol",
    "review/execution-selection",
    "review/execution-extraction",
  ]);

  const { syncAndNavigate } = useCreateProtocol();
  const id = localStorage.getItem("systematicReviewId") || "";

  const [selectionCollaborationMode, setSelectionCollaborationMode] = useState<string>("");
  const [extractionCollaborationMode, setExtractionCollaborationMode] = useState<string>("");

  const [isSameConfiguration, setIsSameConfiguration] = useState(false);
  const [extractionAccordionIndex, setExtractionAccordionIndex] = useState<number>(-1);
  const [acceptMajority, setAcceptMajority] = useState(false);

  const [savedReviewMode, setSavedReviewMode] = useState<any>(null);
  const [selectionConfig, setSelectionConfig] = useState<StageConfig | null>(null);
  const [extractionConfig, setExtractionConfig] = useState<StageConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectionChange = useCallback((data: StageConfig) => setSelectionConfig(data), []);
  const handleExtractionChange = useCallback((data: StageConfig) => setExtractionConfig(data), []);

  useEffect(() => {
    if (!appContext) return;
    if (windowWidth < 1000 && appContext.sidebarState === "open") {
      appContext.setSidebarState("collapsed");
    }
  }, [windowWidth, appContext?.sidebarState]);

  useEffect(() => {
    if (!id) return;
    getReviewMode(id)
      .then((data) => {
        if (!data) return;
        setSavedReviewMode(data);
        setSelectionCollaborationMode(readStageMode(data, "SELECTION"));
        setExtractionCollaborationMode(readStageMode(data, "EXTRACTION"));
        const saved =
          data.selection?.replication ?? data.selection?.split ??
          data.extraction?.replication ?? data.extraction?.split;
        setAcceptMajority(!!saved?.acceptMajority);
      })
      .catch((err) => console.error("Erro ao buscar review-mode:", err));
  }, [id]);

  if (!appContext) return null;

  const saveReviewMode = async (): Promise<boolean> => {
    if (!id) return true;

    const extraction: StageConfig | null =
      isSameConfiguration && selectionConfig
        ? { ...selectionConfig, stage: "EXTRACTION" }
        : extractionConfig;

    const requests = [selectionConfig, extraction]
      .filter((c): c is StageConfig => c !== null)
      .map((c) => updateReviewMode(id, buildStageBody(c, acceptMajority)));

    if (requests.length === 0) return true;

    setIsSaving(true);
    try {
      await Promise.all(requests);
      return true;
    } catch (err) {
      console.error("Erro ao salvar review-mode:", err);
      toast({
        title: t("collaboration.saveError", "Não foi possível salvar a configuração de colaboração."),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveAndNavigate = async (path: string) => {
    if (isSaving) return;
    const saved = await saveReviewMode();
    if (saved) syncAndNavigate(path);
  };

  return (
    <ProtocolFormLayout
      headerText={t("collaboration.headerText", "Collaboration / Colaboração")}
      navButtons={(
        <>
          <NavButton
            event={() =>
              saveAndNavigate(`/review/planning/protocol/selection-and-extraction/${id}`)
            }
            text={t("collaboration.navButton.back", "Back")}
          />
          <NavButton
            event={() =>
              saveAndNavigate(`/review/planning/protocol/risk-of-bias-assessment/${id}`)
            }
            text={t("collaboration.navButton.next", "Next")}
          />
        </>
      )}
    >
      <Flex flexDirection="column" alignItems="space-between">
        <Accordion
          allowToggle
          borderColor="#FFFFFF"
        >
          <AccordionItem>
            <h2 style={{ color: "#2E4B6C" }}>
              <AccordionButton>
                <Box flex="1" textAlign="center">
                  <Heading size="lg">
                    {t("review/execution-selection:header")}
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={2}>
              <Box p={6} bg="white" w="100%">
                <Flex w="100%" justifyContent="center" mb={selectionCollaborationMode ? 6 : 0}>
                  <RadioGroup onChange={setSelectionCollaborationMode} value={selectionCollaborationMode}>
                    <Stack direction="row" spacing={10}>
                      <Radio value="replication" colorScheme="blue">
                        {t("collaboration.options.replication")}
                      </Radio>
                      <Radio value="division" colorScheme="blue">
                        {t("collaboration.options.division")}
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Flex>
                <CollaborationTable
                  stage="selection"
                  mode={selectionCollaborationMode}
                  onDataChange={handleSelectionChange}
                  initialData={savedReviewMode?.selection}
                />
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Accordion
          allowToggle
          index={isSameConfiguration ? -1 : extractionAccordionIndex}
          onChange={(index) => {
            if (typeof index === "number") {
              setExtractionAccordionIndex(index);
            }
          }}
          borderColor="#FFFFFF"
        >
          <AccordionItem isDisabled={isSameConfiguration}>
            <h2 style={{ color: "#2E4B6C" }} >
              <AccordionButton>
                <Box flex="1" textAlign="center">
                  <Heading size="lg">
                    {t("review/execution-extraction:header")}
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={2}>
              <Box p={6} bg="white" w="100%">
                <Flex w="100%" justifyContent="center" mb={extractionCollaborationMode ? 6 : 0}>
                  <RadioGroup onChange={setExtractionCollaborationMode} value={extractionCollaborationMode}>
                    <Stack direction="row" spacing={10}>
                      <Radio value="replication" colorScheme="blue">
                        {t("collaboration.options.replication")}
                      </Radio>
                      <Radio value="division" colorScheme="blue">
                        {t("collaboration.options.division")}
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Flex>
                <CollaborationTable
                  stage="extraction"
                  mode={extractionCollaborationMode}
                  onDataChange={handleExtractionChange}
                  initialData={savedReviewMode?.extraction}
                />
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Checkbox
          isChecked={isSameConfiguration}
          onChange={(e) => setIsSameConfiguration(e.target.checked)}
        >
          <Text>
            {t("collaboration.checkbox")}
          </Text>
        </Checkbox>

        <Flex
          align="center"
          gap=".5rem"
          py=".5rem"
          mt={3}
          borderRadius="6px"
          bg="#FFFFFF"
          color="#263C56"
          fontWeight="bold"
          w="fit-content"
          whiteSpace="nowrap"
        >
          <BsPeopleFill size="1rem" />
          <Checkbox
            isChecked={acceptMajority}
            onChange={(event) => setAcceptMajority(event.target.checked)}
            sx={{
              "& .chakra-checkbox__control": {
                borderColor: "#263C56",
                _checked: {
                  bg: "#263C56",
                  borderColor: "#263C56",
                },
              },
              "& .chakra-checkbox__label": {
                fontWeight: "bold",
                marginInlineStart: ".5rem",
              },
            }}
          >
            {t("collaboration.majorityButton")}
          </Checkbox>
        </Flex>
      </Flex>
    </ProtocolFormLayout>
  );
}