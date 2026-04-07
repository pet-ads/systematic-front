import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import Footer from "./subcomponents/Footer";
import Article from "./subcomponents/Article/Article";

import HeroSection from "./subcomponents/HeroSection";
import img1 from "../../../../assets/images/landing/homepagePhotos/examploPhoto01.png";
import img2 from "../../../../assets/images/landing/homepagePhotos/examploPhoto02.png";
import exemple from "../../../../assets/images/landing/homepagePhotos/examploPhoto01.png";
// import "../../index.css";
import Header from "./subcomponents/Header";
import CollaboratorsCarousel from "./subcomponents/CollaboratorsCaroulse";

export default function Homepage() {
  const { t } = useTranslation("landing/homepage");

  return (
    <Box height={"100vh"} overflow={"auto"}>
      <Header show={true} />

      <Flex bg="gray.200" direction={"column"} pt="60px">
        <HeroSection />

        <Article
          header={t("about.title")}
          bodyText={t("about.text")}
          src={exemple}
          alt={"foto de exemplo"}
          imgPosition={"left"}
          style="light"
          id={"sobre"}
        />

        <Article
          header={t("tutorials.title")}
          bodyText={t("tutorials.text")}
          src={img2}
          alt={"foto de exemplo"}
          imgPosition={"right"}
          style="dark"
          id={"tutoriais"}
        />

        <CollaboratorsCarousel />

        <Article
          header={t("contact.title")}
          bodyText={t("contact.text")}
          src={img1}
          alt={"foto de exemplo"}
          imgPosition={"right"}
          style="dark"
          id={"contato"}
        />

        <Article
          header={t("community.title")}
          bodyText={t("community.text")}
          src={img2}
          alt={"foto de exemplo"}
          imgPosition={"left"}
          style="light"
          id={"comuinidade"}
        />
      </Flex>

      <Footer />
    </Box>
  );
}
