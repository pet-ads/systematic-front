// External library
import { Flex } from "@chakra-ui/react";

// Services
import useGetReviewCard from "../../services/useGetReviewCard";

// Components
import FlexLayout from "../../../../components/structure/Flex/Flex";
import Header from "../../../../components/structure/Header/Header";
import Loader from "../../../../components/feedback/Loader";

// Factory
import RenderCards from "./factory/cards/RenderCards";
import RenderCreateNewReview from "./factory/cards/RenderCreateNewReview";

// Styles
import { flexStyles } from "./styles";

export default function UserArea() {
  const { cardData, isLoaded } = useGetReviewCard();

  return (
    <FlexLayout defaultOpen={0} navigationType="Default">
      <Header text="My Systematic Reviews" />
      <Flex sx={flexStyles} w={"100%"} align="center" justify="center">
        {!isLoaded && <Loader />}

        {cardData && cardData.length == 0 && isLoaded && (
          <RenderCreateNewReview />
        )}

        {cardData && cardData.length > 0 && isLoaded && (
          <RenderCards data={cardData} />
        )}
      </Flex>
    </FlexLayout>
  );
}
