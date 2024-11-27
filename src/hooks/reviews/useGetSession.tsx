import axios from "../../interceptor/interceptor"

const useGetSession = async (source: string) => {
    const token = localStorage.getItem("accessToken");
    const options = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const id = localStorage.getItem('systematicReviewId');
    const url = `/api/v1/systematic-study/${id}/search-session-source/${source}`;

    return await axios.get(url, options);
}

export default useGetSession;