import { Button, Flex, Text, } from "@chakra-ui/react";

import { ArticlePreviewProps } from "./StudyData";

import { CheckCircleIcon, InfoIcon, WarningIcon } from "@chakra-ui/icons";
import { IoIosCloseCircle } from "react-icons/io";
import { LuFeather } from "react-icons/lu";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { capitalize } from "../../../utils/CapitalizeText";

export default function ArticlePreview({ studyData }: ArticlePreviewProps) {
  const statusIconMap: Record<
    string,
    {
      icon: React.ReactNode;
      color: string;
    }
  > = {
    INCLUDED: {
      icon: <CheckCircleIcon color="green.500" />,
      color: "green",
    },
    DUPLICATED: {
      icon: <InfoIcon color="blue.500" />,
      color: "blue",
    },
    EXCLUDED: {
      icon: <IoIosCloseCircle color="red.500" size="1.4rem" />,
      color: "red",
    },
    UNCLASSIFIED: {
      icon: <WarningIcon color="yellow.500" />,
      color: "yellow",
    },
  };

  const priorityIconMap: Record<
    string,
    {
      icon: React.ReactNode;
      color: string;
    }
  > = {
    VERY_LOW: {
      icon: <MdKeyboardDoubleArrowDown color="#D32F2F" size="1.5rem" />,
      color: "red",
    },
    LOW: {
      icon: <MdKeyboardArrowDown color="#FBC02D" size="1.5rem" />,
      color: "yellow",
    },
    HIGH: {
      icon: <MdKeyboardArrowUp color="#F57C00" size="1.5rem" />,
      color: "orange",
    },
    VERY_HIGH: {
      icon: <MdKeyboardDoubleArrowUp color="#388E3C" size="1.5rem" />,
      color: "green",
    },
  };

  const selectionStatus = statusIconMap[studyData.selectionStatus];
  const priorityLevel = priorityIconMap[studyData.readingPriority];

  const pathToReference = studyData.doi;

  const handleRedirectToReference = () => {
    if (!pathToReference) return;
    window.open(pathToReference, "_blank");
  };

  return (
    <Flex
      w="100%"
      flexDirection="column"
      padding="1rem"
      paddingTop="0rem"
      fontFamily="Times New Roman, serif"
      h="fit-content"
    >
      <Flex
        display="flex"
        lineHeight="1"
        gap="2rem"
        flexDirection="column"
        w="100%"
        p=".25rem"
        h="100%"
      >
        <Flex
          alignItems="center"
          justifyContent={pathToReference ? "space-between" : "end"}
          gap="1rem"
        >
          {pathToReference ? (
            <Button
              onClick={handleRedirectToReference}
              leftIcon={<LuFeather />}
              fontSize="0.9rem"
              fontWeight="bold"
              bg="blue.600"
              color="white"
              borderRadius="lg"
              boxShadow="md"
              transition="all 0.3s ease"
              h="2rem"
              _hover={{
                bg: "blue.700",
                boxShadow: "lg",
              }}
              _active={{
                bg: "blue.800",
              }}
            >
              Acessar DOI
            </Button>
          ) : null}
          <Flex
            alignItems="center"
            justifyContent="center"
            h="2rem"
            px={4}
            py={2}
            gap={2}
            bg={`${selectionStatus.color}.100`}
            color={`${selectionStatus.color}.700`}
            fontWeight="semibold"
            fontSize="1rem"
            borderRadius="lg"
            boxShadow="md"
            transition="all 0.3s ease"
            _hover={{
              bg: `${selectionStatus.color}.200`,
            }}
          >
            {selectionStatus.icon}
            {studyData.selectionStatus}
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            h="2rem"
            px={4}
            py={2}
            gap={2}
            bg={`${priorityLevel.color}.100`}
            color={`${priorityLevel.color}.700`}
            fontWeight="semibold"
            fontSize="1rem"
            borderRadius="lg"
            boxShadow="md"
            transition="all 0.3s ease"
            _hover={{
              bg: `${priorityLevel.color}.200`,
            }}
          >
            {priorityLevel.icon}
            {capitalize(
              studyData.readingPriority.toString().toLowerCase() || ""
            ).replace("_", " ")}
          </Flex>
        </Flex>
        <Flex>
          <Text marginBottom={"7px"} w="30%" align={"left"}>
            <Text fontSize={"14px"} fontWeight={"bold"}>
              Type: {studyData.studyType}
            </Text>
          </Text>
          <Text
            fontSize={"16px"}
            align={"right"}
            as="i"
            fontWeight={"Bold"}
            w="70%"
          >
            {studyData.venue}, {studyData.year}
          </Text>
        </Flex>

        <Text
          fontSize={["xl", "2xl", "3xl", "4xl"]}
          fontWeight={"bold"}
          fontFamily={"Boboni"}
          lineHeight={"2.3rem"}
          align={"center"}
          whiteSpace={"normal"}
          wordBreak={"break-word"}
        >
          {studyData.title}
        </Text>

        <Text p="1" lineHeight={"1.5rem"} fontWeight={"Bold"} align={"center"}>
          {studyData.authors}
        </Text>

        <Flex
          fontFamily={"Literata"}
          flexDirection={"column"}
          align={"right"}
          gap="15px"
          pb="60px"
        >
          <Text fontSize={"xxl"} lineHeight={"1.5rem"} textAlign="justify">
            <b>Abstract:</b> {studyData.abstract}
          </Text>
          <Text fontSize={"xxl"} lineHeight={"1.5rem"} textAlign="justify">
            <b>Keywords:</b> {studyData.keywords}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
