// External Libraries
import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Radio, RadioGroup, Stack } from "@chakra-ui/react";

// Context & Hooks
import AppContext from "@features/shared/context/ApplicationContext";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

// Components
import ProtocolFormLayout from "../../components/common/protocolForm";
import CollaborationTables from "./subcomponents/CollaborationTable";

export default function Collaboration() {
  const windowWidth = useWindowWidth();
  const appContext = useContext(AppContext);
  const { t } = useTranslation("review/planning-protocol");

  // State to track which radio button is selected
  const [collaborationMode, setCollaborationMode] = useState<string>("");

  if (!appContext) return null;
  const { sidebarState, setSidebarState } = appContext;

  useEffect(() => {
    if (windowWidth < 1000 && sidebarState === "open") setSidebarState("collapsed");
  }, [windowWidth, sidebarState, setSidebarState]);

  return (
    <ProtocolFormLayout
      headerText={t("collaboration.headerText", "Collaboration / Colaboração")}
      navButtons={<></>}
    >
      <Box p={6} bg="white" borderRadius="md" border="1px solid #E2E8F0" w="100%">
        {/* Top Radio Buttons */}
        <RadioGroup onChange={setCollaborationMode} value={collaborationMode} mb={collaborationMode ? 6 : 0}>
          <Stack direction="row" spacing={10}>
            <Radio value="replication" colorScheme="blue">
              {t("collaboration.options.replication", "replicação de estudos")}
            </Radio>
            <Radio value="division" colorScheme="blue">
              {t("collaboration.options.division", "divisão de trabalho")}
            </Radio>
          </Stack>
        </RadioGroup>

        {/* Separated Subcomponent rendering the tables */}
        <CollaborationTables mode={collaborationMode} />
      </Box>
    </ProtocolFormLayout>
  );
}