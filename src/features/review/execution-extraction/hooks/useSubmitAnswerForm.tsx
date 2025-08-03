// External library
import useToaster from "@components/feedback/Toaster";

import type {
  AnswerStrucuture,
  HandleSendAnswerProps,
} from "../types";

interface SendAnswerProps {
  answers: HandleSendAnswerProps[];
}
interface SubmitAnswerFormProps {
  responses: AnswerStrucuture[];
  handleSendAnswer: ({ answers }: SendAnswerProps) => Promise<void>;
  mutateQuestion: () => void;
}

export function useSubmitAnswerForm({
  responses,
  handleSendAnswer,
  mutateQuestion,
}: SubmitAnswerFormProps) {
  const toast = useToaster();

  const handleSubmitAnswer = () => {
    const formatedResponses = responses.map((res) => {
      const response = {
        answer:
          res.type === "NUMBERED_SCALE"
            ? Number(res.answer.value)
            : res.answer.value,
        questionId: res.questionId,
        type: res.type,
      };
      return response;
    });

    const hasIncompleteAnswers = responses.some((res) => {
      if (res.answer == null) return true;
      return res.answer.value === "" || res.answer.value == null;
    });

    if (hasIncompleteAnswers) {
      toast({
        title: "Please complete all answers before submitting.",
        description: undefined,
        status: "warning",
        duration: 'low'
      });
      return;
    }

    try {
      handleSendAnswer({ answers: formatedResponses });
      mutateQuestion();

      toast({
        title: "Response sent successfully!",
        description: undefined,
        status: "success",
        duration: 'low'
      });
    } catch (error) {
      toast({
        title: "Error sending response",
        description: "Try again later.",
        status: "error",
        duration: 'low'
      });
    }
  };

  return { handleSubmitAnswer };
}
