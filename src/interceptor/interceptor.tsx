import axios from "axios";

const Axios = axios.create({
    baseURL: "http://localhost:8080",
});

Axios.interceptors.response.use((response) => response, async (error) => {
    if(error.response.status == 401 || error.response.status == 500){
        try{
            const response = await Axios.post("/api/v1/auth/refresh", {}, {withCredentials: true});
            console.log(response);
            
            if(response.status == 200){
                localStorage.setItem("accessToken", response.data.accessToken);
                error.config.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

                return axios(error.config)
            }
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
    else throw error;
})

export default Axios;