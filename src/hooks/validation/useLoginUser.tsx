import axios from '../../interceptor/interceptor';
import userToLoginProp from "../../../public/interfaces/userToLogin"
import useStorageUserData from '../temporaryHooks/useStorageUserData';

export default async function useLoginUser(data: userToLoginProp){
    const storageUserData = useStorageUserData(data);

    const response = await axios.post("/api/v1/auth", data, {withCredentials: true});
    console.log(response);
    localStorage.setItem("myReviewsLink", response.data._links["find-my-reviews"].href);

    storageUserData();
    return response;
}