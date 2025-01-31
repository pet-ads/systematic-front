// import { useEffect, useState } from 'react';
import ArticleInterface from '../../public/interfaces/ArticleInterface';
import axios from '../interceptor/interceptor';
import { StudyInterface } from '../../public/interfaces/IStudy';
import getRequestOptions from '../utils/getRequestOptions';
import useSWR from 'swr';

interface HttpResponse {
  studyReviews: ArticleInterface[] | StudyInterface[];
}

// const useGetAllReviewArticles = (reload: boolean) => {
const useGetAllReviewArticles = () => {
    const id = localStorage.getItem('systematicReviewId');
    const options = getRequestOptions();
    // const [articles, setArticles] = useState<ArticleInterface[] | StudyInterface[]>([]);
  
    // useEffect(() => {
    //   console.log("useGetAllReviewArticles carregando artigos, reload:", reload);
      
    //   axios.get(path, options)
    //     .then(res => {
    //       console.log("Dados recebidos:", res.data.studyReviews);
    //       setArticles(res.data.studyReviews || []);
    //     })
    //     .catch(error => {
    //       console.error('Falha ao buscar estudos:', error);
    //       setArticles([]); // Limpar artigos em caso de erro
    //     });
    // }, [reload, path]);
  
    const {data, mutate, error} = useSWR(`http://localhost:8080/api/v1/systematic-study/${id}/study-review`, fetchAllArticlesReview, {
      revalidateOnFocus: true,
      revalidateOnMount: true
    })

    async function fetchAllArticlesReview(){
      try {
        const response = await axios.get<HttpResponse>(`http://localhost:8080/api/v1/systematic-study/${id}/study-review`, options);
        return response.data.studyReviews || [];
      } catch (error) {
        console.error("Error fetching articles", error);
        throw error;
      }
    }



    return {articles: data, mutate, error}
    ;
}

export default useGetAllReviewArticles;