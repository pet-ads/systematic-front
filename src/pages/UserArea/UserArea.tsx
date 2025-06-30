// External library
import { Flex } from "@chakra-ui/react";

// Hooks
import useGetReviewCard from "../../hooks/reviewCard/useGetReviewCard";

// Components
import FlexLayout from "../../components/ui/Flex/Flex";
import Header from "../../components/ui/Header/Header";
import Loader from "../../components/Icons/Loader";
import RenderCards from "./utils/RenderCards";
import RenderCreateNewReview from "./utils/RenderCreateNewReview";

// Styles
import { flexStyles } from "./styles/flexStyles";

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
