import { Flex, Text, Image, Button, Heading, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface IArticle {
  header: string;
  bodyText: string;
  src: string;
  alt: string;
  imgPosition: string;
  style: string;
  id: string;
}

export default function Article({ header, bodyText, src, alt, imgPosition, style, id }: IArticle) {
  const { t } = useTranslation("landing/homepage")

  interface CustomStyles {
    textColor: string;
    background: string;
    buttonColor: string;
  }

  const styles: CustomStyles = {
    textColor: "",
    background: "",
    buttonColor: "",
  };

  if (style === "dark") {
    styles.background = "#526D82";
    styles.buttonColor = "gray";
    styles.textColor = "#FDF0D5";
  }
  if (style === "light") {
    styles.background = "#C9D9E5";
    styles.buttonColor = "blackAlpha";
    styles.textColor = "#301E1A";
  }

  let mainDirection: "column" | "column-reverse" = "column";
  let imgDirection: "row" | "row-reverse" = "row";
  let imgIndex: number = 1;
  let textIndex: number = 2;

  if (imgPosition === "right") {
    imgDirection = "row";
    imgIndex = 2;
    textIndex = 1;
  } else if (imgPosition === "top") {
    mainDirection = "column-reverse";
    imgIndex = 2;
    textIndex = 1;
  } else if (imgPosition === "bottom") {
    mainDirection = "column-reverse";
    imgIndex = 1;
    textIndex = 2;
  }

  return (
    <Flex
      direction={mainDirection}
      gap="50px"
      pt="30px"
      pb="30px"
      pl="150px"
      pr="150px"
      background={styles.background}
      id={id}
      w={"100%"}
      minHeight={"100vh"}
    >
      {" "}
      <Box
        paddingTop={"4%"}
        h="80vh"
        display={"flex"}
        justifyContent={"center"}
        flexDir={mainDirection}
        gap={10}
        w={"100% "}
      >
        <Flex gap="10em" direction={imgDirection} justifyContent={"center"}>
          {imgPosition === "left" || imgPosition === "top" ? (
            <>
              <Image
                src={src}
                alt={alt}
                borderRadius="3px"
                order={imgIndex}
                maxW={"400px"}
                maxHeight={"400px"}
                objectFit={"scale-down"}
              />

              <Flex direction="column" w={"35%"} 
              justifyContent={"flex-end"} gap="50px" order={textIndex}>

                <Heading color={styles.textColor} >
                  {header}
                </Heading>
                <Text color={styles.textColor}>{bodyText}</Text>

                <Button borderRadius={"3px"} w="30%" colorScheme={styles.buttonColor}>
                  {t("articleButton")}
                </Button>

              </Flex>

            </>
          ) : (
            <>
              <Flex direction="column" w={"35%"} justifyContent={"flex-start"} gap="50px" order={textIndex}>

                <Heading color={styles.textColor}>
                  {header}
                </Heading>

                <Text color={styles.textColor}>{bodyText}</Text>

                <Button w="30%" borderRadius={"3px"} colorScheme={styles.buttonColor}>
                  {t("articleButton")}
                </Button>

              </Flex>

              <Image 
                src={src}
                alt={alt}
                borderRadius="3px"
                order={imgIndex}
                maxW={"400px"}
                maxHeight={"400px"}
                objectFit={"scale-down"} />
            </>

          )}

        </Flex>

      </Box>

    </Flex>
  );
}
