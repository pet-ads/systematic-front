import useSWR from "swr";
import Axios from "../../../../infrastructure/http/axiosClient";

const useFetchDataBases = () => {
  const id = localStorage.getItem("systematicReviewId");
  const path = `systematic-study/${id}/protocol`;

  const { data, error, isLoading, mutate } = useSWR(path, async () => {
    const response = await Axios.get(path, { withCredentials: true });
    return response.data.content.informationSources as string[];
  }, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
  });

  return {
    databases: data || [],
    error,
    isLoading,
    mutate,
  };
};
export default useFetchDataBases;
