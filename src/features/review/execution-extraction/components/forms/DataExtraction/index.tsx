// External library
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import { BsSend } from "react-icons/bs";

// Component
import CreateResponseComponent from "@features/review/execution-extraction/factory/CreateResponseComponents/index.tsx";

// Hooks
import { useExtractionFormSubmission } from "@features/review/execution-extraction/services/useExtractionFormSubmission.tsx";
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Types
import {
  AnswerProps,
  ArticleAnswerStrucuture,
  FormType,
} from "../../../types.ts";

interface DataExtractionFormProps {
  currentId: number;
  questions: ArticleAnswerStrucuture;
  mutateQuestion: () => void;
  handlerUpdateAnswer: (
    articleId: number | undefined,
    questionId: string,
    type: FormType,
    response: AnswerProps,
  ) => void;
}

export default function DataExtraction({
  currentId,
  questions,
  handlerUpdateAnswer,
  mutateQuestion,
}: DataExtractionFormProps) {
  const reviewId = localStorage.getItem("systematicReviewId");
  const { toGo } = useNavigation();
  const { submitResponses } = useExtractionFormSubmission({
    responses: questions ?? {},
    onQuestionsMutated: mutateQuestion,
  });
  const hasAnyQuestion = questions && questions.extractionQuestions.length > 0;

  return (
    <FormControl
      w="100%"
      height="100%"
      bg="white"
      overflowY="auto"
      p={{ base: "1rem 0", md: "2rem 0" }}
    >
      <Box>
        {Object.entries(questions).map(
          ([sectionKey, sectionQuestions], index) => {
            const typeFormKey =
              sectionKey === "extractionQuestions"
                ? "EXTRACTION"
                : "RISK_OF_BIAS";
            const formatedFormKey =
              typeFormKey === "EXTRACTION" ? "Extraction" : "Risk of Bias";
            const isRiskOfBiasKey = typeFormKey === "RISK_OF_BIAS";

            if (
              !Array.isArray(sectionQuestions) ||
              sectionQuestions.length < 1
            ) {
              if (isRiskOfBiasKey) {
                return null;
              }
              return (
                <Box key={sectionKey}>
                  {index > 0 && <Divider />}
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
                    <Text fontSize="md" fontWeight="bold" color="gray.800">
                      No questions found
                    </Text>

                    <Button
                      leftIcon={<FaPlusCircle />}
                      mt="1rem"
                      variant="outline"
                      colorScheme="gray"
                      onClick={() =>
                        toGo(
                          `/review/planning/protocol/selection-and-extraction/${reviewId}`,
                        )
                      }
                    >
                      Create Questions
                    </Button>
                  </Flex>
                </Box>
              );
            }

            return (
              <Box key={sectionKey}>
                {index > 0 && <Divider />}
                <Box mb="1.5rem" px={{ base: "1rem", md: "2rem" }}>
                  <Heading
                    size="md"
                    color="black"
                    fontWeight="semibold"
                    pb="0.5rem"
                    borderBottom="2px solid"
                    borderColor="gray.200"
                  >
                    {formatedFormKey}
                  </Heading>
                </Box>
                {sectionQuestions.map((question) => (
                  <Box
                    key={`${typeFormKey}-${currentId}-${question.questionId}`}
                    mb="1rem"
                    px={{ base: "1rem", md: "2rem" }}
                  >
                    <CreateResponseComponent
                      articleId={currentId}
                      questionId={question.questionId}
                      updateResponse={handlerUpdateAnswer}
                      typeform={typeFormKey}
                      answer={question.answer}
                    />
                  </Box>
                ))}
              </Box>
            );
          },
        )}
      </Box>
      {hasAnyQuestion && (
        <Flex w="100%" justifyContent="flex-end" p="1.25rem 2rem" mt="1.5rem">
          <Button
            leftIcon={<BsSend fontSize="1rem" />}
            type="submit"
            onClick={submitResponses}
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
            size="md"
            px="1.5rem"
            width="6.5rem"
          >
            Enviar
          </Button>
        </Flex>
      )}
    </FormControl>
  );
}