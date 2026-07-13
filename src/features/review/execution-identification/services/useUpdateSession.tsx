import { KeyedMutator } from "swr";
import Axios from "../../../../infrastructure/http/axiosClient";
import useToaster from "@components/feedback/Toaster";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

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
    const { t } = useTranslation("review/execution-identification");
    const { id } = useParams<{ id: string }>();

    const updateSession = async () => {
        try {
            const studyId = id || localStorage.getItem("systematicReviewId");
            const url = `systematic-study/${studyId}/search-session/${sessionId}`;
            
            const response = await Axios.put(url, {
                "searchString": searchString,
                "additionalInfo": comment,
                "source": type
            });
            
            if(!response) throw new Error();
            
            mutate();
            toast({
                title: t("dataBaseCard.identificationModal.toasts.sessionUpdatedSuccess"),
                status: "success",
            });
        } catch(error) {
            toast({
                title: t("dataBaseCard.identificationModal.toasts.sessionUpdatedError"),
                status: "error",
            });
        }
    };

    return { updateSession };
}