import axios from '../../interceptor/interceptor';

export default async function fetchProtocol(systematicStudyId: string) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const options = {
            headers: { Authorization: `Bearer ${accessToken}` }
        }

        const response = await axios.get(`/api/v1/systematic-study/${systematicStudyId}/study-review`, options);
        return response.data;
    } catch (error) {
        console.error("Error fetching studies:", error);
        throw error;
    }
}
