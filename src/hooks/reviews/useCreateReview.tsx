import { useEffect, useState } from "react";
import axios from "../../interceptor/interceptor";

import { useNavigate } from "react-router-dom";
import useSystematicStudyInfo from "./useSystematicStudyInfo";

interface useCreateReviewPutProps{
    title: string;
    description: string;
    id: string;
}

interface useCreateReviewPostProps{
    title: string;
    description: string;
    collaborators: string[]
}

const useCreateReview = () => {
    
    const [isTitleValid, setIsTitleValid] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [collaborators, setCollaborators] = useState<string[]>([]);
    const [isReturn, setIsReturn] = useState(false);
    const [id, setId] = useState('');

    const navigate = useNavigate();

    useEffect(() => {

        async function fetch() {
    
          const id = localStorage.getItem('systematicReviewId');
          console.log(id);

          if(id) {
            setIsReturn(true);
            setId(id);
    
            const reviewData = await useSystematicStudyInfo(id);
    
            setTitle(reviewData.title);
            setDescription(reviewData.description);
            console.log(reviewData);
          }
          
        }
    
        fetch();
    
      }, [])

    async function useCreateReviewPut({title, description, id}: useCreateReviewPutProps) {
        try {
            const url = `/api/v1/systematic-study/${id}`;
            const token = localStorage.getItem('accessToken');
    
            const data = {
                title,
                description,
            }
    
            const options = {
                headers: { Authorization: `Bearer ${token}` }
            }
    
            const response = await axios.put(url, data, options);
            
            return response;
        }
        catch(err) { 
            console.log(err); 
        }
    }

    async function useCreateReviewPost({title, description, collaborators}: useCreateReviewPostProps) {
        const url = '/api/v1/systematic-study';

        if (!description){
            description = "null";
        }

        const data = {
            title,
            description,
            collaborators
        }

        try{
            const accessToken = localStorage.getItem('accessToken');
            const options = {
                headers: { Authorization: `Bearer ${accessToken}` }
            }

            const response = await axios.post(url, data, options);

            return response.data.systematicStudyId;
        } catch(err){
            console.log(err);
        }
    }

    function handleTitle(e: React.ChangeEvent<HTMLInputElement>) { setTitle(e.target.value); }

    function handleDescription(e: React.ChangeEvent<HTMLTextAreaElement>) { setDescription(e.target.value); }

    async function handlePost() {
        if(title === '') setIsTitleValid(false);

        else {
            const reviewId = await useCreateReviewPost( { title, description, collaborators } )
            
            localStorage.setItem('systematicReviewId', reviewId);

            navigate(`/newRevision/protocol/${reviewId}`);
        }
    }

    async function handlePut() {
        if (title === '') setIsTitleValid(false);

        else {
            await useCreateReviewPut( { title, description, id } )
            navigate(`/newRevision/protocol/${id}`);
        }
    }

    return { useCreateReviewPut, useCreateReviewPost, title, description, collaborators, isReturn,
    handleTitle, handleDescription, setDescription, setTitle, setIsTitleValid, handlePost, handlePut, isTitleValid };
}

export default useCreateReview;