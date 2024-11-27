import axios from "axios";
import useDeleteUserData from "../temporaryHooks/useDeleteUserData";

export default function useLogout() {
  const deleteUserData = useDeleteUserData();

  const logout = async () => {
      const response = await axios.post("/api/v1/auth/logout", {}, {withCredentials: true})
      console.log(response);
      deleteUserData();
  };

  return logout;
}