// External libraries
import { Box } from "@chakra-ui/react";

// Components
import DataBaseCard from "../Cards/DatabaseCards";
import Header from "../../../components/ui/Header/Header";
import FlexLayout from "../../../components/ui/Flex/Flex";

// Context
import { StudySelectionProvider } from "../../../components/Context/StudiesSelectionContext";

// Hooks
import useFetchDataBases from "../../../hooks/fetch/useFetchDataBases";

// Styles
import { conteiner, dataBaseconteiner } from "../styles/Identification";

export default function Identification() {
  const { databases } = useFetchDataBases();
  // console.log(databases);
  return (
    <StudySelectionProvider>
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
            {databases.map((data, index) => {
              return <DataBaseCard text={data} key={index} />;
            })}
          </Box>
        </Box>
      </FlexLayout>
    </StudySelectionProvider>
  );
}
