import { Box } from "@chakra-ui/react";
import DataBaseCard from "./Cards/DatabaseCards";
import Header from "../../components/ui/Header/Header";
import useFetchDataBases from "../../hooks/fetch/useFetchDataBases";
import { conteiner, dataBaseconteiner } from "./styles/Identification";
import FlexLayout from "../../components/ui/Flex/Flex";
import { useEffect, useState } from "react";

export default function Identification() {
  const [id, setId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem("systematicReviewId");
    if(id){
     setId(id);
    }
  }, [])

  const url = `/systematic-study/${id}/protocol`
  const { databases } = useFetchDataBases(url);
  console.log(databases);

  return (
    <FlexLayout defaultOpen={1} navigationType="Accordion">
      <Header text="Studies Identification" />
      <Box
        sx={conteiner}
        justifyItems={"center"}
        boxSizing={"border-box"}
        alignItems={"center"}
        display={"flex"}
        flexDirection={"column"}
        w={"100%"}
      >
        
        <Box sx={dataBaseconteiner}>
          {databases.map((data) => {
            return <DataBaseCard text={data} />;
          })}
        </Box>
      </Box>
    </FlexLayout>
  );
}
