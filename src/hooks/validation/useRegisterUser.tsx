import axios from '../../interceptor/interceptor';
import sendUserToRegisterProp from "../../../public/interfaces/userToRegisterInterface"

export default async function useRegisterUser(data: sendUserToRegisterProp) {
    const url = 'http://localhost:8080/';
    return axios.post(`${url}api/v1/user`, data);
}