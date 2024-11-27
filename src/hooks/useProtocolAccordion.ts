import axios from 'axios';
import { useEffect, useState } from 'react'

const useProtocolAccordion = () => {
    const [showResearchQuestions, setShowResearchQuestions] = useState(false);
    const [showPicoc, setShowPicoc] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem('systematicReviewId');
        const url = `/systematic-study/${id}/protocol`;
        const token = localStorage.getItem('accessToken');
        const options = {
            headers: { Authorization: `Bearer ${token}` }
        }

        if(!id) throw new Error("Failed to get id");

        axios.get(url, options)
            .then(res => {
                const researchQuestions = res.data.content.researchQuestions;
                console.log(researchQuestions);

                function isPicocInitialized(){
                    return (res.data.content.picoc.control && res.data.content.picoc.control.trim() !== "") ||
                           (res.data.content.picoc.intervention && res.data.content.picoc.intervention.trim() !== "") ||
                           (res.data.content.picoc.outcome && res.data.content.picoc.outcome.trim() !== "") ||
                           (res.data.content.picoc.population && res.data.content.picoc.population.trim() !== ""); 
                }
                
                function isPicocFinished(){
                    return res.data.content.picoc.control !== null && res.data.content.picoc.intervention !== null
                    && res.data.content.picoc.outcome !== null && res.data.content.picoc.population !== null; 
                }

                if(researchQuestions.length > 0) setShowResearchQuestions(true);
                
                if(isPicocFinished() || isPicocInitialized()) setShowPicoc(true);
            })
            .catch(e => console.error(e + 'Fail to request the review protocol'))
            .finally(() => setLoading(false));
    }, [])

    return { showResearchQuestions, showPicoc, setShowResearchQuestions, loading }
}

export default useProtocolAccordion;