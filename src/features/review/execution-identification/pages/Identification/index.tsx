// External library
import { Box, Button, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";

// Components
import DataBaseRequired from "../../../shared/components/structure/DataBaseRequired";
import DataBaseCard from "./subcomponents/cards/DatabaseCard";
import Header from "../../../../../components/structure/Header/Header";
import FlexLayout from "../../../../../components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";

// Service
import useFetchDataBases from "../../../shared/services/useFetchDataBases";
import assignStudies from "./services/assignStudies";

// Styles
import { conteiner, dataBaseconteiner, assingStudiesButton, assingStudiesButtonDisabled } from "./styles";

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

  const [isAssignmentAvailable, setIsAssignmentAvailable] = useState<boolean>(true);

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
          sx={isAssignmentAvailable ? assingStudiesButton : assingStudiesButtonDisabled}
          onClick={() => assignStudies(setIsAssignmentAvailable)}
        >
          Assing Studies
        </Button>
      </Tooltip>
    </FlexLayout>
  );
}
