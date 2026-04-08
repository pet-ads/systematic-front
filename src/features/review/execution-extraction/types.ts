export interface Questions {
  code: string;
  description: string;
  lower: number;
  higher: number;
  options: string[] | null;
  questionId: string | null;
  questionType: string | null;
  scales: Record<string, number>;
  systematicStudyId: string | null;
  context: string;
}

export type TypeOfQuestions =
  | "TEXTUAL"
  | "NUMBERED_SCALE"
  | "LABELED_SCALE"
  | "PICK_LIST"
  | "PICK_MANY";

export type AnswerProps = {
  value: string | string[] | number | { name: string; value: number } | null;
  type: TypeOfQuestions;
};

export interface HandleSendAnswerProps {
  questionId: string;
  answer: string | string[] | number | { name: string; value: number } | null;
  type: TypeOfQuestions;
}

export interface SendAnswerProps {
  answers: HandleSendAnswerProps[];
}

export type FormType = "EXTRACTION" | "RISK_OF_BIAS";

export type Answer = {
  value: string | string[] | number | { name: string; value: number } | null;
};

export type AnswerStrucuture = {
  questionId: string;
  description: string;
  code: string;
  type: TypeOfQuestions;
  answer: Answer;
};

export type ArticleAnswerStrucuture = {
  extractionQuestions: AnswerStrucuture[];
  robQuestions: AnswerStrucuture[];
};

export interface FormStructure {
  currentId: number;
  article: Record<number, ArticleAnswerStrucuture>;
  questionsFiltered: AnswerStrucuture[];
  mutateQuestion: () => void;
  handlerUpdateAnswer: (
    articleId: number | undefined,
    questionId: string,
    type: FormType,
    response: AnswerProps
  ) => void;
}

export interface CreateResponseProps {
  articleId: number;
  questionId: string;
  answer: Answer;
  typeform: FormType;
  isInvalid?: boolean;
  updateResponse: (
    articleId: number,
    questionId: string,
    type: FormType,
    response: AnswerProps,
  ) => void;
}
