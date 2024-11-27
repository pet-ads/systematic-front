import axios from "../../../interceptor/interceptor";

interface TextualProps{
    question: string;
    questionId: number;
    reviewId: string;
}

interface PickListProps{
    question: string;
    questionId: number;
    reviewId: string;
    options: string[];
}

interface NumberScaleProps{
    question: string;
    questionId: number;
    reviewId: string;
    lower: number,
    higher: number
}

interface LabeledProps{
    question: string;
    questionId: number;
    reviewId: string;
    scales: Record<string, number>;
}

const useSendExtractionForm = (adress: string) => {
    async function sendTextualQuestion({question, questionId, reviewId}: TextualProps){
        const url = `/api/v1/systematic-study/${reviewId}/protocol/${adress}/textual`;
        const data = {
            code: questionId,
            description: question
        }

        try{
            const response = await axios.post(url, data, {withCredentials: true});
            console.log(response);
            return response.data.questionId;
        } catch(err){
            console.log(err);
        }
    }

    async function sendPickListQuestion({question, questionId, reviewId, options}: PickListProps){
        const url = `/api/v1/systematic-study/${reviewId}/protocol/${adress}/pick-list`;
        const data = {
            code: questionId,
            description: question,
            options
        }

        try{
            const response = await axios.post(url, data, {withCredentials: true});
            console.log(response);
            return response.data.questionId;
        } catch(err){
            console.log(err);
        }
    }

    async function sendNumberScaleQuestion({question, questionId, reviewId, lower, higher}: NumberScaleProps){
        const url = `/api/v1/systematic-study/${reviewId}/protocol/${adress}/number-scale`;
        console.log(typeof(lower));
        
        const data = {
            code: questionId,
            description: question,
            lower: lower,
            higher: higher
        }

        console.log(lower);

        try{
            const response = await axios.post(url, data, {withCredentials: true});
            console.log(response);
            return response.data.questionId;
        } catch(err){
            console.log(err);
        }
    }

    async function sendLabeledListQuestion({question, questionId, reviewId, scales}: LabeledProps) {
        const url = `/api/v1/systematic-study/${reviewId}/protocol/${adress}/labeled-scale`;
        const data = {
            code: questionId,
            description: question,
            scales
        }

        try{
            const response = await axios.post(url, data, {withCredentials: true});
            console.log(response);
            return response.data.questionId;
        } catch(err){
            console.log(err);
        }
    }

    async function updateTextualQuestion({question, questionId, reviewId}: TextualProps, serverId: string | null, questionType: string){
        const url = `/api/v1/systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
        const data = {
            questionType: questionType,
            code: questionId,
            description: question
        }

        try{
            const response = await axios.put(url, data, {withCredentials: true});
            console.log(response);
            return response.data.questionId;
        } catch(err){
            console.log(err);
        }
    }

    async function updatePickListQuestion({question, questionId, reviewId, options}: PickListProps, serverId: string | null, questionType: string){
        const url = `/api/v1/systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
        const data = {
            questionType: questionType,
            code: questionId,
            description: question,
            options
        }

        try{
            const response = await axios.put(url, data, {withCredentials: true});
            console.log(response);
            return response.data.questionId;
        } catch(err){
            console.log(err);
        }
    }

    async function updateNumberScaleQuestion({question, questionId, reviewId, lower, higher}: NumberScaleProps, serverId: string | null){
        const url = `/api/v1/systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
        console.log(typeof(lower));
        
        const data = {
            code: questionId,
            description: question,
            lower: lower,
            higher: higher,
            questionType: 'NUMBERED_SCALE'
        }

        try{
            const response = await axios.put(url, data, {withCredentials: true});
            console.log(response);
            return response.data.questionId;
        } catch(err){
            console.log(err);
        }
    }

    async function updateLabeledListQuestion({question, questionId, reviewId, scales}: LabeledProps, serverId: string | null) {
        const url = `/api/v1/systematic-study/${reviewId}/protocol/${adress}/${serverId}`;
        const data = {
            code: questionId,
            description: question,
            scales,
            questionType: 'LABELED_SCALE'
        }

        try{
            const response = await axios.put(url, data, {withCredentials: true});
            console.log(response);
            return response.data.questionId;
        } catch(err){
            console.log(err);
        }
    }

    return { sendTextualQuestion, sendPickListQuestion, sendNumberScaleQuestion, sendLabeledListQuestion, updateTextualQuestion, updatePickListQuestion, updateNumberScaleQuestion, updateLabeledListQuestion};
}

export default useSendExtractionForm;