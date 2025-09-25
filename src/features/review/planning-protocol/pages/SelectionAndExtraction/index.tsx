// External library
import { Box, FormControl } from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import FlexLayout from "@components/structure/Flex/Flex";
import InteractiveTable from "@features/review/planning-protocol/pages/StepThree/subcomponents/tables/InteractiveTable";
import CardDefault from "@components/common/cards";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function SelectionAndExtraction() {
  const {
    selectionAndExtraction,
    handleChangeSelectionAndExtraction,
    syncAndNavigate,
  } = useCreateProtocol();

  const { dataCollectionProcess, selectionProcess } = selectionAndExtraction;

  const id = localStorage.getItem("systematicReviewId") || "";
  const url = `systematic-study/${id}/protocol`;

  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Protocol: Selection And Extraction" />
      <CardDefault
        backgroundColor="#fff"
        borderRadius="1rem"
        withShadow={false}
      >
        <FormControl
          m={"20px auto 0"}
          display={"flex"}
          gap={10}
          flexDir={"column"}
          w={"60vw"}
          alignItems={"center"}
        >
          <TextAreaInput
            value={selectionProcess}
            onChange={(event) => {
              handleChangeSelectionAndExtraction(
                "selectionProcess",
                event.target.value
              );
            }}
            label="Study Selection Process"
            placeholder="Enter selection process"
            isSectionTitle
          />
          <TextAreaInput
            value={dataCollectionProcess}
            onChange={(event) => {
              handleChangeSelectionAndExtraction(
                "dataCollectionProcess",
                event.target.value
              );
            }}
            label="Data Collection Process"
            placeholder="Enter the data colletion process"
            isSectionTitle
          />
          <InteractiveTable id={id} url={url} label={"Extraction Questions"} />
          <Box
            w={"60vw"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"end"}
          >
            <NavButton
              event={() =>
                syncAndNavigate(
                  `/review/planning/protocol/information-sources-and-search-strategy/${id}`
                )
              }
              text="Back"
            />
            <NavButton
              event={() =>
                syncAndNavigate(
                  `/review/planning/protocol/risk-of-bias-assessment/${id}`
                )
              }
              text="Next"
            />
          </Box>
        </FormControl>
      </CardDefault>
    </FlexLayout>
  );
}
