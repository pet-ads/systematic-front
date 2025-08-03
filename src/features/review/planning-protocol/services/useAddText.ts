import { useState, useEffect } from "react";
import useCreateProtocol from "./useCreateProtocol";
import axios from "../../../../infrastructure/http/axiosClient";
import useToaster from "@components/feedback/Toaster";

export function useAddText(context: string) {
  const { sendAddText } = useCreateProtocol();
  const [AddText, setAddText] = useState<string[]>([]);
  const toast = useToaster();

  useEffect(() => {
    const id = localStorage.getItem("systematicReviewId");
    const token = localStorage.getItem("accessToken");
    const options = {
      headers: { Authorization: `Bearer: ${token}` },
    };

    async function fetchAddTexts() {
      const response = await axios.get(
        `http://localhost:8080/systematic-study/${id}/protocol`,
        options
      );

      if (context == "Research Questions")
        setAddText(response.data.content.researchQuestions);

      if (context == "Keywords") setAddText(response.data.content.keywords);
      console.log("API Response:", response.data);
      console.log("Keywords:", response.data.content.keywords);

      if (context == "Inclusion criteria") {
        const criterias = response.data.content.eligibilityCriteria
          .filter((item: { description: string; type: string }) => {
            if (item.type == "INCLUSION") return item;
          })
          .map((item: { description: string; type: string }) => {
            return item.description;
          });

        setAddText(criterias);
      }

      if (context == "Exclusion criteria") {
        const criterias = response.data.content.eligibilityCriteria
          .filter((item: { description: string; type: string }) => {
            if (item.type == "EXCLUSION") return item;
          })
          .map((item: { description: string; type: string }) => {
            return item.description;
          });

        setAddText(criterias);
      }
    }

    fetchAddTexts();
  }, []);

  const handleAddText = (newKeyword: string) => {
    setAddText((prevKeyWord) => {
      if (prevKeyWord.includes(newKeyword)) {
        toast({
          title: "Duplicate Keyword",
          description: "This keyword already exists!",
          status: "warning",
          duration: "low",
        });
        return prevKeyWord;
      }

      const data = [...prevKeyWord, newKeyword];
      sendAddText(data, context);
      return data;
    });
  };

  return { AddText, handleAddText, setAddText };
}
