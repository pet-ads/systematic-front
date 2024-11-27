import { useEffect, useState } from "react";
import axios from "../interceptor/interceptor";
import ArticleInterface from "../../public/interfaces/ArticleInterface";

const useGetSessionStudies = (sessionId:string) => {
    const reviewId = localStorage.getItem('systematicReviewId');
    const token = localStorage.getItem('accessToken');
    const url = `/api/v1/systematic-study/${reviewId}/find-by-search-session/${sessionId}`;
    const [articles, setArticles] = useState<ArticleInterface[]>([]);

    const options = {
        headers: { Authorization: `Bearer ${token}` }
    }

    useEffect(() => {
        axios.get(url, options)
            .then(res => {
                console.log(res);
                setArticles(res.data.studyReviews);
            });
    }, [])

    return articles;
}

export default useGetSessionStudies;