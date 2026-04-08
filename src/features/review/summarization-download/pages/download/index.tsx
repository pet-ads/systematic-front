// External library
import { Box } from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import FlexLayout from "@components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";

// Buttons
import { DownloadProtocolMenu } from "@features/review/summarization-graphics/components/buttons/DownloadProtocolButton";

export default function Download() {
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