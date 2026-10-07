import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Radio, RadioGroup, Stack, Flex, Accordion, AccordionButton, Heading, AccordionIcon, AccordionPanel, AccordionItem, Checkbox, Text } from "@chakra-ui/react";

import AppContext from "@features/shared/context/ApplicationContext";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

import ProtocolFormLayout from "../../components/common/protocolForm";
import CollaborationTable from "./subcomponents/CollaborationTable";
import NavButton from "@components/common/buttons/NavigationButton";

import useCreateProtocol from "../../services/useCreateProtocol";

export default function Collaboration() {
  const windowWidth = useWindowWidth();
  const appContext = useContext(AppContext);
  const { t } = useTranslation([
    "review/planning-protocol",
    "review/execution-selection",
    "review/execuion-extraction"
  ]);

  const { syncAndNavigate } = useCreateProtocol();
  const id = localStorage.getItem("systematicReviewId") || "";

  const [selectionCollaborationMode, setSelectionCollaborationMode] = useState<string>("");
  const [extractionCollaborationMode, setExtractionCollaborationMode] = useState<string>("");

  const [isSameConfiguration, setIsSameConfiguration] = useState(false);

  if (!appContext) return null;
  const { sidebarState, setSidebarState } = appContext;

  useEffect(() => {
    if (windowWidth < 1000 && sidebarState === "open") setSidebarState("collapsed");
  }, [windowWidth, sidebarState, setSidebarState]);

  return (
    <ProtocolFormLayout
      headerText={t("collaboration.headerText", "Collaboration / Colaboração")}
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate(`/review/planning/protocol/selection-and-extraction/${id}`)
            }
            text={t("collaboration.navButton.back", "Back")}
          />
          <NavButton
            event={() =>
              syncAndNavigate(`/review/planning/protocol/risk-of-bias-assessment/${id}`)
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
                <CollaborationTable mode={selectionCollaborationMode} />
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>


        <Accordion
          allowToggle
          borderColor="#FFFFFF"
        >
          <AccordionItem>
            <h2 style={{ color: "#2E4B6C" }}>
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
                <CollaborationTable mode={extractionCollaborationMode} />
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
      </Flex>
    </ProtocolFormLayout>
  );
}