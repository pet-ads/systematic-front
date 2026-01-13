// Infra
import Axios from "../../../../infrastructure/http/axiosClient";

// Types
interface TextualProps {
  question: string;
  questionId: number;
  reviewId: string;
}

interface PickListProps {
  question: string;
  questionId: number;
  reviewId: string;
  options: string[];
}

interface NumberScaleProps {
  question: string;
  questionId: number;
  reviewId: string;
  lower: number;
  higher: number;
}

interface LabeledProps {
  question: string;
  questionId: number;
  reviewId: string;
  scales: Record<string, number>;
}
interface PickManyProps {
  question: string;
  questionId: number;
  reviewId: string;
  options: string[];
}

const useSendExtractionForm = (adress: string) => {
  async function sendTextualQuestion({
    question,
    questionId,
    reviewId,
  }: TextualProps) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/textual`;
    const data = {
      code: questionId,
      description: question,
    };

    try {
      const response = await Axios.post(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function sendPickListQuestion({
    question,
    questionId,
    reviewId,
    options,
  }: PickListProps) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/pick-list`;
    const data = {
      code: questionId,
      description: question,
      options,
    };

    try {
      const response = await Axios.post(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function sendNumberScaleQuestion({
    question,
    questionId,
    reviewId,
    lower,
    higher,
  }: NumberScaleProps) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/number-scale`;
    console.log(typeof lower);

    const data = {
      code: questionId,
      description: question,
      lower: lower,
      higher: higher,
    };

    console.log(lower);

    try {
      const response = await Axios.post(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function sendLabeledListQuestion({
    question,
    questionId,
    reviewId,
    scales,
  }: LabeledProps) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/labeled-scale`;
    const data = {
      code: questionId,
      description: question,
      scales,
    };

    try {
      const response = await Axios.post(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function sendPickManyQuestion({
    question,
    questionId,
    reviewId,
    options,
  }: PickManyProps) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/pick-many`;
    const data = {
      code: questionId,
      description: question,
      options,
    };

    try {
      const response = await Axios.post(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function updateTextualQuestion(
    { question, questionId, reviewId }: TextualProps,
    serverId: string | null,
    questionType: string
  ) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
    const data = {
      questionType: questionType,
      code: questionId,
      description: question,
    };

    try {
      const response = await Axios.put(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function updatePickListQuestion(
    { question, questionId, reviewId, options }: PickListProps,
    serverId: string | null,
    questionType: string
  ) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
    const data = {
      questionType: questionType,
      code: questionId,
      description: question,
      options,
    };

    try {
      const response = await Axios.put(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function updateNumberScaleQuestion(
    { question, questionId, reviewId, lower, higher }: NumberScaleProps,
    serverId: string | null
  ) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
    console.log(typeof lower);

    const data = {
      code: questionId,
      description: question,
      lower: lower,
      higher: higher,
      questionType: "NUMBERED_SCALE",
    };

    try {
      const response = await Axios.put(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function updateLabeledListQuestion(
    { question, questionId, reviewId, scales }: LabeledProps,
    serverId: string | null
  ) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
    const data = {
      code: questionId,
      description: question,
      scales,
      questionType: "LABELED_SCALE",
    };

    try {
      const response = await Axios.put(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function updatePickManyQuestion(
    { question, questionId, reviewId, options }: PickManyProps,
    serverId: string | null,
    questionType: string
  ) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
    const data = {
      questionType: questionType,
      code: questionId,
      description: question,
      options,
    };

    try {
      const response = await Axios.put(url, data, { withCredentials: true });
      return response.data.questionId;
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteQuestion(
    {reviewId }: PickManyProps,
    serverId: string | null,
  ) {
    const url = `systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
    
    try {
      const response = await Axios.delete(url, { withCredentials: true });
      return response
    } catch (err) {
      alert('erro')
      console.log(err);
    }
  }

  return {
    sendTextualQuestion,
    sendPickListQuestion,
    sendNumberScaleQuestion,
    sendLabeledListQuestion,
    sendPickManyQuestion,
    updateTextualQuestion,
    updatePickListQuestion,
    updateNumberScaleQuestion,
    updateLabeledListQuestion,
    updatePickManyQuestion,
    deleteQuestion,
  };
};

export default useSendExtractionForm;
