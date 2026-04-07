import { Button, Flex, Heading } from "@chakra-ui/react";
import Carousel from "@features/landing/components/carousel/CollaboratorCarousel";
import CollaboratorCard from "@features/landing/pages/Collaborators/subcomponents/cards/CollaboratorCards";
import shuffleElements from "@features/landing/pages/Collaborators/subcomponents/shuffleElements";
import collaborators from "../../../../../../mocks/collaborators";
import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

export default function CollaboratorsCarousel() {
  const collabInfosShuffled = shuffleElements(collaborators);
  const { t } = useTranslation("landing/homepage")

  return (
    <Flex
      id="colaboradores"
      minHeight={"100vh"}
      direction={"column"}
      justify={"center"}
      alignItems={"center"}
    >
      <Flex h="100%" alignItems={"center"} direction={"column"}>
        <Heading mb={"1.5em"}>{t("collaborators.title")}</Heading>

        <Flex wrap={"wrap"} h="100%" align="center" justify="center">
          <Carousel>
            {collabInfosShuffled.map((person) => {
              return <CollaboratorCard collaborator={person} />;
            })}
          </Carousel>
        </Flex>

        <Button borderRadius={"3px"} bgColor={"gray"} color={"white"}>
          <Link to={"/collaborators"} target="_blank">
            {t("collaborators.button")}
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
}
