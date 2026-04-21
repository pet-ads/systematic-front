import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { TbArticleOff } from "react-icons/tb";

export default function NoDataMessage() {
  const container = {
    w: "100%",
    h: "calc(100% - 1rem)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    bg: "gray.50",
    borderRadius: "md",
    boxShadow: "sm",
    gap: ".5rem",
  };
  const { t } = useTranslation("review/summarization-graphics")

  return (
    <Flex sx={container}>
      <TbArticleOff size={"4rem"} color="#263C56" />
      <Text fontSize="xl" fontWeight="bold" color="gray.600">
        {t("noDataMessage.message")}
      </Text>
      <Text fontSize="md" color="gray.500">
        {t("noDataMessage.text")}
      </Text>
    </Flex>
  );
}
