import { useEffect, useState } from "react";

const useFetchTableData = (url: string) => {
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url); // Use a URL fornecida
        const data = await response.json();
        if (data && data.headerData && data.bodyData) {
          setHeaderData(data.headerData);
          setBodyData(data.bodyData);
        } else {
          console.error("O arquivo JSON não possui a estrutura esperada.");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, [url]); // Certifique-se de adicionar a URL como dependência do useEffect

  return { headerData, bodyData };
};

export default useFetchTableData;
