import axios from 'axios';

export const useGetTokens = async (username: string, password: string) => {
    const userData = {
        username: username,
        password: password
    }

    try{
        const response = await axios.post(`/api/v1/auth`, userData);
        console.log("Resposta do hook");
        if(response.status === 200){
            console.log(response);
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem('myRevisionsLink', response.data._links['find-my-reviews'].href);
        }
        else{
            throw new Error("Falha ao fazer requisição");
        }  
    } catch(error){
        console.error(error);
    }
    
    return 1;
}
