import axios from '../../interceptor/interceptor';

export default async function fetchProtocol(systematicStudyId: string) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const options = {
            headers: { Authorization: `Bearer ${accessToken}` }
        }

        const response = await axios.get(`/systematic-study/${systematicStudyId}/protocol`, options);
        return response.data.content;
    } catch (error) {
        console.error("Error fetching protocol:", error);
        throw error;
    }
}