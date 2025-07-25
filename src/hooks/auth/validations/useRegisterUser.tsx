import axios from "axios";
import userToRegisterProp from "../../../types/userToRegisterInterface";

export default async function useRegisterUser(data: userToRegisterProp) {
  const url = "http://localhost:8080/";
  return axios.post(`${url}api/v1/user`, data);
}
