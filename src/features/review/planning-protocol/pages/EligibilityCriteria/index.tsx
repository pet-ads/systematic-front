// External library
import { Box, FormControl } from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import AddTextTable from "../../components/common/inputs/text/AddTextTable";
import TextAreaInput from "../../../../../components/common/inputs/InputTextArea";
import AddSelectionTable from "../../components/common/inputs/selection/AddSelectionTable";
import FlexLayout from "@components/structure/Flex/Flex";
import CardDefault from "@components/common/cards";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function EligibilityCriteria() {
  const {
    eligibilityCriteria,
    handleChangeEligibilityCriteria,
    syncAndNavigate,
  } = useCreateProtocol();

  const { studyTypeDefinition } = eligibilityCriteria;
  const id = localStorage.getItem("systematicReviewId");

  const languageOptions = [
    "ENGLISH",
    "PORTUGUESE",
    "FRENCH",
    "SPANISH",
    "GERMAN",
  ];

  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Protocol: Eligibility Criteria" />
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
          <AddTextTable
            text="Inclusion criteria"
            placeholder="Enter the criteria"
            isSectionTitle
          />
          <AddTextTable
            text="Exclusion criteria"
            placeholder="Enter the criteria"
            isSectionTitle
          />
          <TextAreaInput
            value={studyTypeDefinition}
            onChange={(event) => {
              handleChangeEligibilityCriteria(
                "studyTypeDefinition",
                event.target.value
              );
            }}
            label="Study Type Definition"
            placeholder="Enter the study type definition"
            isSectionTitle
          />
          <AddSelectionTable
            label="Languages"
            options={languageOptions}
            placeholder={"Select language"}
            typeField="select"
            isSectionTitle
          />
          <Box
            w={"60vw"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"end"}
          >
            <NavButton
              event={() =>
                syncAndNavigate(`/review/planning/protocol/picoc/${id}`)
              }
              text="Back"
            />
            <NavButton
              event={() =>
                syncAndNavigate(
                  `/review/planning/protocol/information-sources-and-search-strategy/${id}`
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
