// External library
import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

// Hooks
import { useNavigation } from "@features/shared/hooks/useNavigation";

const Unauthorized: React.FC = () => {
  const { toGo } = useNavigation();

  const handleBackToHome = () => {
    localStorage.clear();
    toGo("/");
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="2xl" mt={6} mb={2}>
        403
      </Heading>
      <Text fontSize="xl" color="gray.500">
        Desculpe, você não tem autorização para acessar esta página.
      </Text>
      <Button mt={6} colorScheme="teal" onClick={handleBackToHome}>
        Voltar para a Página Inicial
      </Button>
    </Box>
  );
};

export default Unauthorized;
