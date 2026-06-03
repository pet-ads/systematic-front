// External library
import { Box, Flex, Text } from "@chakra-ui/react";
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

export default function MyReviews() {
  const { t } = useTranslation("user/my-reviews");
  
  const { cardData: ownedReviews, isLoaded: isOwnedLoaded } = useGetReviewCard();

  const participatingReviews: any[] | undefined = []; 
  const isParticipatingLoaded = true; 
  
  const isLoaded = isOwnedLoaded && isParticipatingLoaded;

  return (
    <FlexLayout navigationType="Default">
      <Box w="100%" px="1rem" py="1rem" h="fit-content">
        <Flex w="100%" h="2.5rem" alignItems="center" mb="2rem">
          <Header text={t("header")} />
        </Flex>
      </Box>
      <CardDefault backgroundColor="white" borderRadius="1rem">
        <Box w="100%" px="2rem" py="2rem"> 
          
          {!isLoaded ? (
            <Flex w="100%" justify="center">
              <Loader />
            </Flex>
          ) : (
            <Flex direction="column" w="100%" align="flex-start">
              
              <Box w="100%" mb="2.5rem">
                <Text 
                  fontSize="1.125rem" 
                  fontWeight="600" 
                  color="#334155" 
                  mb="1rem"
                >
                  {t("ownedReviews")}
                </Text>
                
                {!ownedReviews || ownedReviews.length === 0 ? (
                  <Text fontSize="0.875rem" color="gray.500">
                    {t("emptyOwned")}
                  </Text>
                ) : (
                  <RenderCards data={ownedReviews} />
                )}
              </Box>

              <Box w="100%">
                <Text 
                  fontSize="1.125rem" 
                  fontWeight="600" 
                  color="#334155" 
                  mb="1rem"
                >
                  {t("participatingReviews")}
                </Text>
                
                {!participatingReviews || participatingReviews.length === 0 ? (
                  <Text fontSize="0.875rem" color="gray.500">
                    {t("emptyParticipating")}
                  </Text>
                ) : (
                  <RenderCards data={participatingReviews} />
                )}
              </Box>

            </Flex>
          )}
        </Box>
      </CardDefault>
    </FlexLayout>
  );
}
