// External library
import { Box, Flex } from "@chakra-ui/react";

// Components
import DataBaseRequired from "../../../shared/components/structure/DataBaseRequired";
import DataBaseCard from "./subcomponents/cards/DatabaseCard";
import Header from "../../../../../components/structure/Header/Header";
import FlexLayout from "../../../../../components/structure/Flex/Flex";

// Service
import useFetchDataBases from "../../../shared/services/useFetchDataBases";

// Styles
import { conteiner, dataBaseconteiner } from "./styles";

export default function Identification() {
  const { databases } = useFetchDataBases();

  const databaseListIsEmpty = databases.length == 0;

  return (
    <FlexLayout navigationType="Accordion">
      <Box w="100%" px="1rem" py="1rem" h="fit-content">
        <Flex
          w="100%"
          h="2.5rem"
          justifyContent="space-between"
          alignItems="center"
          mb="2rem"
        >
          <Header text="Studies Identification" />
        </Flex>
      </Box>
      <Box 
        sx={conteiner}
        justifyItems={"center"}
        boxSizing={"border-box"}
        alignItems={"center"}
        display={"flex"}
        flexDirection={"column"}
        px="1rem"
      >
        {databaseListIsEmpty && <DataBaseRequired />}
        <Box sx={dataBaseconteiner}>
          {databases.map((data, index) => (
            <DataBaseCard text={data} key={index} />
          ))}
        </Box>
      </Box>
    </FlexLayout>
  );
}
