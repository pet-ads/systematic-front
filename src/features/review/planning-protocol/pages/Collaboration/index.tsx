import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Radio, RadioGroup, Stack, Flex } from "@chakra-ui/react";

import AppContext from "@features/shared/context/ApplicationContext";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

import ProtocolFormLayout from "../../components/common/protocolForm";
import CollaborationTable from "./subcomponents/CollaborationTable";
import NavButton from "@components/common/buttons/NavigationButton";

import useCreateProtocol from "../../services/useCreateProtocol";

export default function Collaboration() {
  const windowWidth = useWindowWidth();
  const appContext = useContext(AppContext);
  const { t } = useTranslation("review/planning-protocol");

  const { syncAndNavigate } = useCreateProtocol();
  const id = localStorage.getItem("systematicReviewId") || "";

  const [collaborationMode, setCollaborationMode] = useState<string>("");

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
      <Box p={6} bg="white" w="100%">
        <Flex w="100%" justifyContent="center" mb={collaborationMode ? 6 : 0}>
          <RadioGroup onChange={setCollaborationMode} value={collaborationMode}>
            <Stack direction="row" spacing={10}>
              <Radio value="replication" colorScheme="blue">
                {t("collaboration.options.replication", "replicação de estudos")}
              </Radio>
              <Radio value="division" colorScheme="blue">
                {t("collaboration.options.division", "divisão de trabalho")}
              </Radio>
            </Stack>
          </RadioGroup>
        </Flex>

        <CollaborationTable mode={collaborationMode} />
      </Box>
    </ProtocolFormLayout>
  );
}