import { useEffect, useState } from 'react';
import ArticleInterface from '../../public/interfaces/ArticleInterface';
import axios from '../interceptor/interceptor';
import { StudyInterface } from '../../public/interfaces/IStudy';

const useGetAllReviewArticles = () => {
    const id = localStorage.getItem('systematicReviewId');
    const token = localStorage.getItem('accessToken');
    const path = `/api/v1/systematic-study/${id}/study-review`;
    const options = {
        headers: {Authorization: `Bearer ${token}`}
    }
    const [articles, setArticles] = useState<ArticleInterface[] | StudyInterface[]>([]);

    useEffect(() => {
        axios.get(path, options)
        .then(res => {
            setArticles(res.data.studyReviews);
        })
        .catch(error => console.error(error + ' Failed to fetch all studies from review'));
    }, [])

    return articles;
}

export default useGetAllReviewArticles;