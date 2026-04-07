import { Flex, Image, Heading, Text, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation("landing/homepage");

  return (
    <Flex
      bg="black"
      alignItems="center"
      gap="50px"
      pl="200px"
      pr="200px"
      pb={"200px"}
      minHeight="100vh"
      justifyContent={"center"}
    >
      <Flex
        gap="5px"
        direction="row"
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Flex direction="column" justifyContent={"flex-start"}>
          <Heading color="white" alignSelf={"center"} fontSize={"60"} pb="50px">
            {t("herosection.heading")}
          </Heading>

          <Text color="white" fontSize={"16"}>
            {t("herosection.text")}
          </Text>

          <Button
            mt="4em"
            borderRadius={"3px"}
            w="30%"
            colorScheme="whiteAlpha"
          >
            {t("herosection.signUp")}
          </Button>
        </Flex>

        <Image
          src="src/assets/images/landing/homepagePhotos/HeroSectionPic.png"
          alt={t("herosection.alt")}
          marginTop={"4em"}
        />
      </Flex>
    </Flex>
  );
}
