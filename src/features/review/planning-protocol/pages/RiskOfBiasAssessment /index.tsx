// External library
import { Box, FormControl } from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import FlexLayout from "@components/structure/Flex/Flex";
import InteractiveTable from "@features/review/planning-protocol/pages/StepThree/subcomponents/tables/InteractiveTable";

// Hooks
import { useNavigation } from "@features/shared/hooks/useNavigation";

export default function RiskOfBiasAssessment() {
  const { toGo } = useNavigation();

  const id = localStorage.getItem("systematicReviewId") || "";
  const url = `http://localhost:8080/systematic-study/${id}/protocol`;

  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Protocol: Risk Of Bias Assessment" />
      <FormControl
        m={"20px auto 0"}
        display={"flex"}
        gap={10}
        flexDir={"column"}
        w={"60vw"}
        alignItems={"center"}
      >
        <InteractiveTable id={id} url={url} label={"Risk of Bias Questions"} />
        <Box
          w={"60vw"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"end"}
        >
          <NavButton
            event={() =>
              toGo(`/review/planning/protocol/selection-and-extraction/${id}`)
            }
            text="Back"
          />
          <NavButton
            event={() =>
              toGo(
                `/review/planning/protocol/analysis-and-synthesis-of-results/${id}`
              )
            }
            text="Next"
          />
        </Box>
      </FormControl>
    </FlexLayout>
  );
}
