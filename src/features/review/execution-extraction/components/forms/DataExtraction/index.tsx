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

  return (
    <FormControl w="100%" height="100%" gap="3rem" bg="white" overflowY="auto">
      <Box gap="5rem">
        {Object.entries(questions).map(
          ([sectionKey, sectionQuestions], index, allQuestions) => {
            const typeFormKey =
              sectionKey == "extractionQuestions"
                ? "EXTRACTION"
                : "RISK_OF_BIAS";

            const formatedFormKey =
              typeFormKey == "EXTRACTION" ? "Extraction" : "Risk Of Bias";

            if (allQuestions.length === 0)
              return (
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
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    No questions found
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    Create questions to register your answers in the data
                    extraction form .
                  </Text>
                  <Button
                    leftIcon={<FaPlusCircle />}
                    sx={button}
                    _hover={{
                      bg: "white",
                      color: "black",
                      border: "2px solid black",
                    }}
                    w="30%"
                    onClick={() =>
                      toGo(`/newReview/ProtocolPartThree/${reviewId}`)
                    }
                  >
                    Create Questions
                  </Button>
                </Flex>
              );

            if (
              !Array.isArray(sectionQuestions) ||
              sectionQuestions.length === 0
            )
              return (
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
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    No questions found
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    {`Create ${formatedFormKey} questions to register your answers.`}
                  </Text>
                  <Button
                    leftIcon={<FaPlusCircle />}
                    sx={button}
                    _hover={{
                      bg: "white",
                      color: "black",
                      border: "2px solid black",
                    }}
                    w="30%"
                    onClick={() =>
                      toGo(`/newReview/ProtocolPartThree/${reviewId}`)
                    }
                  >
                    Create Questions
                  </Button>
                </Flex>
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
                    as="h1"
                    size="lg"
                    color="#263C56"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    position="relative"
                    _after={{
                      content: '""',
                      position: "absolute",
                      bottom: "-5px",
                      left: "0",
                      width: "3.5rem",
                      height: ".5rem",
                      bg: "#263C56",
                    }}
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
      <Flex w="100%" justifyContent="space-between" pb="1rem">
        <Button type="submit" onClick={submitResponses}>
          Enviar
        </Button>
      </Flex>
    </FormControl>
  );
}
