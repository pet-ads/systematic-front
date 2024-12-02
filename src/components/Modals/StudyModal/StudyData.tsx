import {
  IconButton,
  Flex,
  Text,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { StudyInterface } from "../../../../public/interfaces/IStudy";

interface IStudyDataFiel {
  studyData: StudyInterface;
  type: "Selection" | "Extraction";
}

export default function StudyDataFiel({ studyData, type }: IStudyDataFiel) {
  const isTypeValid: boolean = type === "Selection" || type === "Extraction";
  const isTypeSelection: boolean = type === "Selection";

  const selectionSX = {
    bg: "white",
    width: "100%",
    height: "300px",
    flexDirection: "column",
    alignContent: "center",
    overflowY: "scroll",
    padding: "3",
  };

  if (isTypeValid) {
    if (isTypeSelection)
      return (
        <Flex sx={selectionSX}>
          <Flex flexDirection="column" padding="60px">
            <Flex
              display="flex"
              lineHeight="1"
              gap="5"
              flexDirection="column"
              w="100%"
              pt="10px"
              fontFamily={"Merriweather"}
              maxHeight="250px"
            >
              <Flex>
                <Text marginBottom={"7px"} w="30%" align={"left"}>
                  <Text fontSize={"14px"} fontWeight={"bold"}>
                    Type: {studyData.studyType}
                  </Text>
                </Text>
                <Text
                  fontSize={"20px"}
                  align={"right"}
                  as="i"
                  fontWeight={"Bold"}
                  w="70%"
                >
                  {studyData.venue}, {studyData.year}
                </Text>
              </Flex>

              <Text
                fontSize={"35"}
                fontWeight={"bold"}
                fontFamily={"Boboni"}
                lineHeight="1"
                align={"center"}
              >
                {studyData.title}
              </Text>

              <Text p="1" fontWeight={"Bold"} align={"center"}>
                {studyData.authors}
              </Text>

              <Flex
                fontFamily={"Literata"}
                flexDirection={"column"}
                align={"right"}
                gap="15px"
                pb="60px"
              >
                <Text
                  fontSize={"xxl"}
                  textAlign="justify"
                  lineHeight="1.5rem"
                  mb="5px"
                >
                  <b>Abstract.</b> {studyData.abstract}
                </Text>
                <Text fontSize={"xxl"} textAlign="justify" lineHeight="1.5rem">
                  <b>Keywords.</b> {studyData.keywords}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      );
  }

  return <>Wrong value for type of component StudyData</>;
}
