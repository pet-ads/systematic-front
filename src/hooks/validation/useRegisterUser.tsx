import axios from '../../interceptor/interceptor';
import sendUserToRegisterProp from "../../../public/interfaces/userToRegisterInterface"

export default async function useRegisterUser(data: sendUserToRegisterProp) {
    return axios.post(`/api/v1/user`, data);
}