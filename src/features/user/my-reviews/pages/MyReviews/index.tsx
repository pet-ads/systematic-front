// External library
import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// Services
import useGetReviewCard from "../../services/useGetReviewCard";

// Components
import FlexLayout from "@components/structure/Flex/Flex";
import Header from "@components/structure/Header/Header";
import Loader from "@components/feedback/Loader";
import CardDefault from "@components/common/cards";

// Factory
import RenderCards from "../../factory/cards/RenderCards";
import RenderCreateNewReview from "../../factory/cards/RenderCreateNewReview";

// Styles
import { flexStyles } from "./styles";

export default function MyReviews() {
  const { t } = useTranslation("user/my-reviews");
  const { cardData, isLoaded } = useGetReviewCard();

  return (
    <FlexLayout navigationType="Default">
      <Box w="100%" px="1rem" py="1rem" h="fit-content">
        <Flex w="100%" h="2.5rem" alignItems="center" mb="2rem">
          <Header text={t("header")} />
        </Flex>
      </Box>
      <CardDefault backgroundColor="white" borderRadius="1rem">
        <Box w="100%" px="1rem">
          <Flex sx={flexStyles} w={"100%"} align="center" justify="center">
            {!isLoaded && <Loader />}

            {cardData && cardData.length == 0 && isLoaded && (
              <RenderCreateNewReview />
            )}

            {cardData && cardData.length > 0 && isLoaded && (
              <RenderCards data={cardData} />
            )}
          </Flex>
        </Box>
      </CardDefault>
    </FlexLayout>
  );
}
