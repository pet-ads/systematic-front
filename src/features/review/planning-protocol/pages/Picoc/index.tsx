// External library
import { Box, FormControl } from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import FlexLayout from "@components/structure/Flex/Flex";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function Picoc() {
  const { picoc, handleChangePicoc, syncAndNavigate } = useCreateProtocol();

  const id = localStorage.getItem("systematicReviewId");
  const { population, intervention, control, outcome, context } = picoc;

  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Protocol: PICOC" />
      <FormControl
        m={"20px auto 0"}
        display={"flex"}
        gap={10}
        flexDir={"column"}
        w={"60vw"}
        alignItems={"center"}
      >
        <TextAreaInput
          value={population}
          label="Population:"
          placeholder="What is your study population?"
          onChange={(event) => {
            handleChangePicoc("population", event.target.value);
          }}
        />
        <TextAreaInput
          value={intervention}
          label="Intervention:"
          placeholder="What is your intervention?"
          onChange={(event) => {
            handleChangePicoc("intervention", event.target.value);
          }}
        />
        <TextAreaInput
          value={control}
          label="Control:"
          placeholder="What is your control?"
          onChange={(event) => {
            handleChangePicoc("control", event.target.value);
          }}
        />
        <TextAreaInput
          value={outcome}
          label="Outcome:"
          placeholder="What is your outcome?"
          onChange={(event) => {
            handleChangePicoc("outcome", event.target.value);
          }}
        />
        <TextAreaInput
          value={context}
          label="Context:"
          placeholder="What is your context?"
          onChange={(event) => {
            handleChangePicoc("context", event.target.value);
          }}
        />
        <Box
          w={"60vw"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"end"}
        >
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/research-questions/${id}`
              )
            }
            text="Back"
          />
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/eligibility-criteria/${id}`
              )
            }
            text="Next"
          />
        </Box>
      </FormControl>
    </FlexLayout>
  );
}
