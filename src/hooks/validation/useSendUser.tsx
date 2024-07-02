import axios from 'axios';

export async function useSendUser(data: string[]) {
    const url = 'http://localhost:8080/api/v1/user';
    const userData = { //putting the userData in a object 
        username: data[0],
        password: data[1],
        email: data[2],
        country: data[3],
        affiliation: data[4]
    };

    try {
        const response = await axios.post(url, userData);
        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
