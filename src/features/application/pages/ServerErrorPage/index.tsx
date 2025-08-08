// External library
import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

// Hooks
import { useNavigation } from "@features/shared/hooks/useNavigation";

const ServerError: React.FC = () => {
  const { toGo } = useNavigation();

  const handleBackToHome = () => {
    toGo("/");
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="2xl" mt={6} mb={2}>
        500
      </Heading>
      <Text fontSize="xl" color="gray.500">
        Desculpe, houve um erro no servidor. Por favor, tente novamente mais
        tarde.
      </Text>
      <Button mt={6} colorScheme="teal" onClick={handleBackToHome}>
        Voltar para a Página Inicial
      </Button>
    </Box>
  );
};

export default ServerError;
