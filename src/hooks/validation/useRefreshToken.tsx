import axios from "axios";

const refreshAccessToken = async (): Promise<string> => {
    try {
        const response = await axios.post(`/api/v1/auth/refresh`, {}, {withCredentials: true});
        return response.request;
    } catch (err) {
        console.error("Failed to refresh access token:", err);
        throw err;
    }
}

export default refreshAccessToken;
