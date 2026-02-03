// External library
import { ReactNode } from "react";

// Components
import TextualResponse from "../../components/forms/DataExtraction/subcomponents/responses/Textual/index.tsx";
import DropdownList from "../../components/forms/DataExtraction/subcomponents/responses/DropdownList/index.tsx";
import LabeledList from "../../components/forms/DataExtraction/subcomponents/responses/LabeledList/index.tsx";
import NumberScale from "../../components/forms/DataExtraction/subcomponents/responses/NumberScale/index.tsx";

// Hooks
import { useFetchQuestionById } from "@features/review/shared/hooks/useFetchQuestionById.tsx";

// Types
import { CreateResponseProps, TypeOfQuestions } from "../../types.ts";
import MultiSelectionList from "../../components/forms/DataExtraction/subcomponents/responses/MultiSelectionList/index.tsx";

export default function CreateResponseComponent({
  articleId,
  questionId,
  typeform,
  answer,
  updateResponse,
}: CreateResponseProps) {
  const question = useFetchQuestionById({
    questionId,
    type: typeform,
  });

  if (!question) return null;

  const questionTypesMap: Record<TypeOfQuestions, ReactNode> = {
    TEXTUAL: (
      <TextualResponse
        key={question.code}
        question={question.description}
        answer={answer.value as string}
        onResponse={(response) =>
          updateResponse(articleId, questionId, typeform, {
            value: response,
            type: "TEXTUAL",
          })
        }
      />
    ),
    NUMBERED_SCALE: (
      <NumberScale
        key={question.code}
        question={question.description}
        answer={answer.value as string}
        minValue={question.lower}
        maxValue={question.higher}
        onResponse={(response) =>
          updateResponse(articleId, questionId, typeform, {
            value: response,
            type: "NUMBERED_SCALE",
          })
        }
      />
    ),
    LABELED_SCALE: (
      <LabeledList
        key={question.code}
        question={question.description}
        scales={question.scales}
        answer={answer.value as { name: string; value: number }}
        onResponse={(response) =>
          updateResponse(articleId, questionId, typeform, {
            value: response,
            type: "LABELED_SCALE",
          })
        }
      />
    ),
    PICK_LIST: (
      <DropdownList
        key={question.code}
        question={question.description}
        options={question.options || []}
        answer={answer.value as string}
        onResponse={(response) =>
          updateResponse(articleId, questionId, typeform, {
            value: response,
            type: "PICK_LIST",
          })
        }
      />
    ),
    PICK_MANY: (
      <MultiSelectionList
        key={question.code}
        question={question.description}
        options={question.options || []}
        answer={answer.value as string[]}
        onResponse={(response) =>
          updateResponse(articleId, questionId, typeform, {
            value: response,
            type: "PICK_MANY",
          })
        }
      />
    ),
  };

  return questionTypesMap[question.questionType as TypeOfQuestions];
}
