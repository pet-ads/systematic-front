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

// Component
import CreateResponseComponent from "@features/review/execution-extraction/factory/CreateResponseComponents/index.tsx";

// Hooks
import { useExtractionFormSubmission } from "@features/review/execution-extraction/services/useExtractionFormSubmission.tsx";
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Styles
import { button } from "../styles.ts";

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
    response: AnswerProps
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
      gap="3rem"
      bg="white"
      overflowY="auto"
      p=".5rem"
    >
      <Box gap="5rem">
        {Object.entries(questions).map(
          ([sectionKey, sectionQuestions], index) => {
            const typeFormKey =
              sectionKey == "extractionQuestions"
                ? "EXTRACTION"
                : "RISK_OF_BIAS";

            const formatedFormKey =
              typeFormKey == "EXTRACTION" ? "Extraction" : "Risk Of Bias";

            const isExtractionKey = typeFormKey == "RISK_OF_BIAS";

            if (!Array.isArray(sectionQuestions) || sectionQuestions.length < 1)
              return (
                <>
                  {index > 0 && (
                    <Divider
                      orientation="vertical"
                      h=".5rem"
                      bg="#263C56"
                      m="2rem 0"
                    />
                  )}
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                    gap="1rem"
                    p="2rem"
                    borderRadius="8px"
                    border="1px solid #ccc"
                    bg="white"
                    w={"100%"}
                  >
                    <Text
                      fontSize="clamp(0.9rem, 1.5vw, 1rem)"
                      fontWeight="bold"
                      color="gray.700"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      No questions found
                    </Text>

                    <Text
                      fontSize="clamp(0.85rem, 1.2vw, 0.95rem)"
                      color="gray.600"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {isExtractionKey
                        ? `Create ${formatedFormKey} questions to register your answers.`
                        : "(Optional) You can create Risk of Bias questions to assess methodological quality."}
                    </Text>
                    <Button
                      leftIcon={<FaPlusCircle />}
                      sx={button}
                      _hover={{
                        bg: "white",
                        color: "black",
                        border: "2px solid black",
                      }}
                      w="15rem"
                      onClick={() =>
                        toGo(
                          typeFormKey == "EXTRACTION"
                            ? `/review/planning/protocol/selection-and-extraction/${reviewId}`
                            : `/review/planning/protocol/risk-of-bias-assessment/${reviewId}`
                        )
                      }
                    >
                      Create Questions
                    </Button>
                  </Flex>
                </>
              );

            return (
              <Box key={sectionKey}>
                {index > 0 && (
                  <Divider
                    orientation="vertical"
                    h=".5rem"
                    bg="#263C56"
                    m="2rem 0"
                  />
                )}
                <Flex
                  align="center"
                  borderRadius="md"
                  h="3.5rem"
                  boxShadow="sm"
                >
                  <Heading
                    as="h2"
                    fontSize="clamp(1.5rem, 2vw, 1.8rem)"
                    color="#263C56"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {formatedFormKey}
                  </Heading>
                </Flex>
                {sectionQuestions.map((question) => (
                  <CreateResponseComponent
                    key={`${typeFormKey}-${currentId}-${question.questionId}`}
                    articleId={currentId}
                    questionId={question.questionId}
                    updateResponse={handlerUpdateAnswer}
                    typeform={typeFormKey}
                    answer={question.answer}
                  />
                ))}
              </Box>
            );
          }
        )}
      </Box>
      {hasAnyQuestion && (
        <Flex w="100%" justifyContent="space-between" p="1.25rem 0">
          <Button type="submit" onClick={submitResponses}>
            Enviar
          </Button>
        </Flex>
      )}
    </FormControl>
  );
}
