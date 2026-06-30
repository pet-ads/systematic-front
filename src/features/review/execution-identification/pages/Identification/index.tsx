// External library
import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useContext, useEffect } from "react";

// Components
import DataBaseRequired from "../../../shared/components/structure/DataBaseRequired";
import DataBaseCard from "./subcomponents/cards/DatabaseCard";
import Header from "../../../../../components/structure/Header/Header";
import FlexLayout from "../../../../../components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";

// Service
import useFetchDataBases from "../../../shared/services/useFetchDataBases";

// Styles
import { conteiner, dataBaseconteiner } from "./styles";

import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import AppContext from "@features/shared/context/ApplicationContext";

export default function Identification() {
  const window = useWindowWidth();
  const context = useContext(AppContext);
  if(!context) return null;
  const { sidebarState, setSidebarState } = context;
  useEffect(() => {
    if(window < 1000 && sidebarState === "open") setSidebarState("collapsed");
  }, []);
  const { databases } = useFetchDataBases();

  const { t } = useTranslation("review/execution-identification")

  const databaseListIsEmpty = databases.length == 0;

  return (
    <FlexLayout navigationType="Accordion">
      <Header text={t("header")} />
      <CardDefault
        backgroundColor="#fff"
        borderRadius="1rem"
        withShadow={false}
      >
        <Box w="100%" px="1rem" py="1rem" h="fit-content">
          <Flex w="100%" justifyContent="space-between" alignItems="center" mb="2rem"></Flex>
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
      </CardDefault>
    </FlexLayout>
  );
}
