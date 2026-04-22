import { Flex, Icon, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MdSentimentSatisfied } from "react-icons/md";
import NavButton from "@components/common/buttons/NavigationButton";

const container = {
  w: "calc(100% - 2rem)",
  h: "87.5vh",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  bg: "gray.50",
  borderRadius: "1rem",
  boxShadow: "sm",
  gap: ".5rem",
  mr: "2rem",
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

const RenderCreateNewReview = () => {
  const { t } = useTranslation("user/my-reviews");

  return (
    <Flex sx={container}>
      <Icon as={MdSentimentSatisfied} boxSize={"4rem"} color="#263C56" />

      <Text fontSize="xl" fontWeight="bold" color="gray.600">
        {t("createNewReview.welcome")}
      </Text>

      <Text fontSize="md" color="gray.500">
        {t("createNewReview.message")}
      </Text>

      <NavButton
        text={t("createNewReview.button")}
        path="/review/planning/protocol/general-definition"
        sx={button}
        _hover={{
          bg: "white",
          color: "black",
          border: "2px solid black",
        }}
        w="15rem"
        mt={4}
      />
    </Flex>
  );
};

export default RenderCreateNewReview;
