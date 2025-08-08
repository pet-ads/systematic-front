// External library
import { useEffect, useState } from "react";

// Infra
import axios from "../../../../infrastructure/http/axiosClient";

// Service
import useSystematicStudyInfo from "./useSystematicStudyInfo";

// Hooks
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Types
interface useCreateReviewPutProps {
  title: string;
  description: string;
  id: string;
}

interface useCreateReviewPostProps {
  title: string;
  description: string;
  collaborators: string[];
}

const useCreateReview = () => {
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [isReturn, setIsReturn] = useState(false);
  const [id, setId] = useState("");

  const { toGo } = useNavigation();

  useEffect(() => {
    async function fetch() {
      const id = localStorage.getItem("systematicReviewId");
      console.log(id);

      if (id) {
        setIsReturn(true);
        setId(id);

        const reviewData = await useSystematicStudyInfo(id);

        setTitle(reviewData.title);
        setDescription(reviewData.description);
        console.log(reviewData);
      }
    }

    fetch();
  }, []);

  async function useCreateReviewPut({
    title,
    description,
    id,
  }: useCreateReviewPutProps) {
    try {
      let url = `http://localhost:8080/api/v1/systematic-study/${id}`;
      const token = localStorage.getItem("accessToken");

      const data = {
        title,
        description,
      };

      const options = {
        headers: { Authorization: `Bearer ${token}` },
      };

      let response = await axios.put(url, data, options);

      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async function useCreateReviewPost({
    title,
    description,
    collaborators,
  }: useCreateReviewPostProps) {
    const url = "http://localhost:8080/api/v1/systematic-study";

    if (!description) {
      description = "null";
    }

    const data = {
      title,
      description,
      collaborators,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      let options = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      let response = await axios.post(url, data, options);

      return response.data.systematicStudyId;
    } catch (err) {
      console.log(err);
    }
  }

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
  }

  function handleCollaborators(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setCollaborators(value.split(",")); //Separe a string por vírgula!!!
  }

  async function handlePost() {
    if (title === "") setIsTitleValid(false);
    else {
      const reviewId = await useCreateReviewPost({
        title,
        description,
        collaborators,
      });

      localStorage.setItem("systematicReviewId", reviewId);

      toGo(`/newReview/protocol/${reviewId}`);
    }
  }

  async function handlePut() {
    if (title === "") setIsTitleValid(false);
    else {
      await useCreateReviewPut({ title, description, id });
      toGo(`/newReview/protocol/${id}`);
    }
  }

  return {
    useCreateReviewPut,
    useCreateReviewPost,
    title,
    description,
    collaborators,
    isReturn,
    handleTitle,
    handleDescription,
    handleCollaborators,
    setDescription,
    setTitle,
    setIsTitleValid,
    handlePost,
    handlePut,
    isTitleValid,
  };
};

export default useCreateReview;
