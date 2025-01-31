import getRequestOptions from '../utils/getRequestOptions';
import axios from '../interceptor/interceptor';

interface Props {
    studyReviewId: number,
    status: 'INCLUDED' | 'EXCLUDED' | 'DUPLICATED';
}

export const UseChangeStudyExtractionStatus = ({studyReviewId, status}: Props) => {
    const id = localStorage.getItem('systematicReviewId');
    const options = getRequestOptions();
    const path = `http://localhost:8080/api/v1/systematic-study/${id}/study-review/${studyReviewId}/extraction-status`;

    axios.patch(path, { status }, options);
}