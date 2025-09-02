// External library
import { Flex, Text, Button } from "@chakra-ui/react";
import { TbDatabaseOff } from "react-icons/tb";

// Hooks
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Styles
const container = {
  minW: "100%",
  minH: "100%",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  bg: "gray.50",
  borderRadius: "1rem",
  boxShadow: "sm",
  gap: ".5rem",
};

const button = {
  display: "flex",
  borderRadius: ".5rem",
  gap: ".25rem",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  transition: "0.3s ease-in-out",
  boxShadow: "md",
  p: "1rem",
  border: "2px solid white",
  bg: "black",
};

export default function DataBaseRequired() {
  const reviewId = localStorage.getItem("systematicReviewId");

  const { toGo } = useNavigation();

  const handleGoToProtocolPartTwo = () => {
    toGo(
      `/review/planning/protocol/information-sources-and-search-strategy/${reviewId}`
    );
  };

  return (
    <Flex sx={container}>
      <TbDatabaseOff size={"4rem"} color="#263C56" />
      <Text fontSize="xl" fontWeight="bold" color="gray.600">
        No databases registered
      </Text>
      <Text fontSize="md" color="gray.500">
        To continue this stage of the execution, please add at least one
        database. Once added, you can proceed smoothly with your review.
      </Text>
      <Button
        sx={button}
        _hover={{
          bg: "white",
          color: "black",
          border: "2px solid black",
        }}
        w="15rem"
        onClick={handleGoToProtocolPartTwo}
        mt={4}
      >
        Go to database registration
      </Button>
    </Flex>
  );
}
