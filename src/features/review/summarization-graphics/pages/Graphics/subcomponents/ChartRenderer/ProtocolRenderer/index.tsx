import { Box } from "@chakra-ui/react";
import Header from "@components/structure/Header/Header";
import FlexLayout from "@components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";
import ProtocolRenderer from "@features/review/summarization-graphics/pages/Graphics/subcomponents/ChartRenderer/ProtocolRenderer";

export default function Download() 
{
  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Download" />
      <CardDefault
        backgroundColor="#ffffff"
        borderRadius="1rem"
        withShadow={false}
      >
        <Box w="200%" px="1rem" py="1rem" minH="400px" display="flex" justifyContent="center" alignItems="center">
          <ProtocolRenderer />
        </Box>
      </CardDefault>
    </FlexLayout>
  );
}