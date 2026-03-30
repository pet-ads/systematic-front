import { KeyedMutator } from "swr";
import Axios from "../../../../infrastructure/http/axiosClient";
import useToaster from "@components/feedback/Toaster";

interface UpdateSessionProps {
    sessionId?: string;    
    mutate: KeyedMutator<
    {
        id: string;
        systematicStudyd: string;
        userId: string;
        searchString: string;
        additionalInfo: string;
        timestamp: string;
        source: string;
        numberOfRelatedStudies: number;
    }[]
    >;
    searchString: string;
    comment: string;
    type: string;
}

export default function useUpdateSession({
  sessionId,
  mutate,
  searchString,
  comment,
  type
}: UpdateSessionProps) {
    const toast = useToaster();

    const updateSession = async () => {
        try {
            const id = localStorage.getItem("systematicReviewId");
            const url = `systematic-study/${id}/search-session/${sessionId}`;
        
            const response = await Axios.put(url, 
                {
                    "searchString": searchString,
                    "additionalInfo": comment,
                    "source": type
                }
            );
            if(!response) throw new Error();
            mutate();
            toast({
            title: "Session updated successfully",
            status: "success",
            });
        } catch(error) {
            toast({
            title: "Error updating session",
            status: "error",
            });
        }
    };

    return { updateSession };
}
