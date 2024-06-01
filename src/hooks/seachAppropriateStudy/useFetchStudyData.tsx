import { useState, useEffect } from "react";
import { StudyInterface } from "../../../public/interfaces/IStudy";
import { KeywordInterface } from "../../../public/interfaces/KeywordInterface"

export default function useFetchStudyData<U extends StudyInterface | KeywordInterface> (url: string):  U[] | undefined {
  const [requestedData, setRequestedData] = useState<U[]>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Falha ao carregar os dados");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setRequestedData(data);
        } else {
          console.error("O arquivo JSON não possui a estrutura esperada.");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, [url]);

  return requestedData;
};
