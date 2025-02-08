import getRequestOptions from '../utils/getRequestOptions';
import axios from '../interceptor/interceptor';

interface Props {
    studyReviewId: number,
    status: 'INCLUDED' | 'EXCLUDED' | 'DUPLICATED' | 'UNCLASSIFIED';
    criterion: {description: String, type: String};
}

export const UseChangeStudySelectionStatus = ({studyReviewId, status, criterion}: Props) => {
    const id = localStorage.getItem('systematicReviewId');
    const options = getRequestOptions();
    const path = `http://localhost:8080/api/v1/systematic-study/${id}/study-review/${studyReviewId}/selection-status`;

    axios.patch(path, { status, criterion }, options);
}
