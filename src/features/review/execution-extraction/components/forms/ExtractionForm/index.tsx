import { Box, Flex, Text, Icon, VStack } from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";

// Components
import HeaderForm from "../DataExtraction/subcomponents/Header";
import SkeletonLoader from "@components/feedback/Skeleton";
import ArticleHeader from "@features/review/shared/components/table/header/ArticleHeader";

// Hooks
import useFetchAllQuestionsByArticle from "../../../services/useFetchAllQuestionsByArticle";

// Types
import DataExtraction from "../DataExtraction";
import { ArticlePreviewProps } from "@features/review/shared/components/common/tables/StudyData";

export type FormType = "EXTRACTION" | "RISK_OF_BIAS";

export default function ExtractionForm({ studyData }: ArticlePreviewProps) {
  const {
    question,
    currentArticleId,
    handlerUpdateAnswerStructure,
    mutateQuestion,
    isLoading,
  } = useFetchAllQuestionsByArticle();

  if (isLoading) return <SkeletonLoader height="100%" width="100%" />;

  const isAvailableForExtraction = studyData.extractionStatus === "INCLUDED";
  const hasQuestions = !!(
    question &&
    currentArticleId &&
    question[currentArticleId]
  );

  return (
    <Box w="100%" h="calc(100vh - 10rem)" bg="white">
      <ArticleHeader studyData={studyData} />
      <HeaderForm text={studyData.title} />

      <Box w="100%" mt="2rem">
        {isAvailableForExtraction ? (
          hasQuestions ? (
            <DataExtraction
              currentId={currentArticleId}
              handlerUpdateAnswer={handlerUpdateAnswerStructure}
              questions={question[currentArticleId]}
              mutateQuestion={mutateQuestion}
            />
          ) : (
            <Text textAlign="center" color="gray.500" p="2rem">
              Loading questions...
            </Text>
          )
        ) : (
          <Box px={{ base: "1rem", md: "2rem" }}>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              gap="0.75rem"
              p="2rem"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              bg="gray.50"
            >
              <Icon as={LockIcon} w={6} h={6} color="gray.400" />
              <VStack spacing={1}>
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                  Extraction Disabled
                </Text>
                <Text fontSize="sm" color="gray.600">
                  This study is currently marked as{" "}
                  <strong>{studyData.extractionStatus}</strong>. Extraction is
                  only allowed for included studies.
                </Text>
              </VStack>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}
