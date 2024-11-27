import axios from "../../interceptor/interceptor"

const useSystematicStudyInfo = async (id: string) => {
    try {
        const url = `/api/v1/systematic-study/${id}`;
        const token = localStorage.getItem('accessToken');

        const options = {
            headers: { Authorization: `Bearer ${ token }` }
        }

        const response = await axios.get(url, options);
        console.log(response);
        return response.data.content;
    }
    catch (err) {
        console.log(err);
    }
}

export default useSystematicStudyInfo