import { useState, useEffect } from "react";
import axios from "../../interceptor/interceptor";
import getRequestOptions from "../../utils/getRequestOptions";

const useFetchExclusionCriteria = () => {
    const [exclusionCriterias, setInclusionCriterias] = useState<string[]>([]);
    const id = localStorage.getItem("systematicReviewId");
    const path = `/systematic-study/${id}/protocol`;
    const options = getRequestOptions();

    useEffect(() => {
        const fetchCriteria = async () => {
            try {
                const response = await axios.get(path, options);
                const eligibilityCriteria = response.data.content.eligibilityCriteria || [];
                const inclusion = eligibilityCriteria.filter(
                    (e: { definition: string; type: string }) => e.type === "EXCLUSION"
                );
                setInclusionCriterias(inclusion.map((e: { description: string }) => e.description));
            } catch (error) {
                console.error("Failed to fetch exclusion Criteria:", error);
            }
        };

        fetchCriteria();
    }, [options, path])

    return exclusionCriterias;
};

export default useFetchExclusionCriteria;
