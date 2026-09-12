// External library
import { Box, Button, Tooltip } from "@chakra-ui/react";
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
      <Tooltip
        label="There are studies available for assingment"
        placement="top"
        hasArrow
        p=".5rem"
        borderRadius=".25rem"
      >
        <Button
          bgColor="#263C56"
          color="#FFFFFF"
          position="fixed"
          right="5rem"
          bottom="3rem"
          borderRadius="8px"
          _hover={{
            bgColor: "#C9D9E5",
            color: "#263C56",
            boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
          }}
          transition="all 0.3s ease"
          outline="none"
          _focus={{
            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
          }}
        >
          Assing Studies
        </Button>
      </Tooltip>
    </FlexLayout>
  );
}
