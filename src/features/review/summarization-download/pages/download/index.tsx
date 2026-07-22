// External library
import { Box } from "@chakra-ui/react";
import { useContext, useEffect } from "react";

// Components
import Header from "@components/structure/Header/Header";
import FlexLayout from "@components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";

// Buttons
import { DownloadProtocolMenu } from "@features/review/summarization-graphics/components/buttons/DownloadProtocolButton";

import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import AppContext from "@features/shared/context/ApplicationContext";

export default function Download() {
  const window = useWindowWidth();
  const context = useContext(AppContext);
  if(!context) return null;
  const { sidebarState, setSidebarState } = context;
  useEffect(() => {
    if(window < 1000 && sidebarState === "open") setSidebarState("collapsed");
  }, []);
  
  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Download" />
      
      <CardDefault
        backgroundColor="#fff"
        borderRadius="1rem"
        withShadow={false}
      >
        <Box
          w="100%" px="1rem" py="1rem" minH="calc(100vh - 130px)" display="flex" justifyContent="center" alignItems="center"
        >
          <DownloadProtocolMenu />
        </Box>
      </CardDefault>
    </FlexLayout>
  );
}