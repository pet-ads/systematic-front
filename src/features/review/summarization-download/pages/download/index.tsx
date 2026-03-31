// External library
import { Box } from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import FlexLayout from "@components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";

export default function Download() {
  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Download" />
      
      <CardDefault
        backgroundColor="#fff"
        borderRadius="1rem"
        withShadow={false}
      >
        <Box w="100%" px="1rem" py="1rem" minH="400px" display="flex" justifyContent="center" alignItems="center">
          {/* Deixei esse espaço pronto e centralizado! 
            O seu amigo só vai precisar apagar este comentário e colocar o botão dele aqui. 
          */}
        </Box>
      </CardDefault>
    </FlexLayout>
  );
}