// External library
import { Box, FormControl } from "@chakra-ui/react";

// Components
import Header from "@components/structure/Header/Header";
import InputText from "@components/common/inputs/InputText";
import NavButton from "@components/common/buttons/NavigationButton";
import TextAreaInput from "@components/common/inputs/InputTextArea";
import FlexLayout from "@components/structure/Flex/Flex";
import AlertInputText from "@components/common/inputs/AlertInputText";
import CardDefault from "@components/common/cards";

// Pages component
import ResearcherFilter from "./subcomponents/ResearcherFilter";

// Service
import useCreateReview from "../../services/useStructureReview";

export default function GeneralDefinition() {
  const {
    generalDefinition,
    handleChangeGeneralDefinition,
    handlePost,
    handlePut,
    isReturn,
    isTitleValid,
  } = useCreateReview();

  const { title, description, objectives } = generalDefinition;

  return (
    <FlexLayout navigationType="Accordion">
      <Header text="Protocol: General Definition" />
      <CardDefault backgroundColor="#fff" borderRadius="1rem" withShadow={false}>
        <FormControl
          m={"20px auto 0"}
          display={"flex"}
          gap={10}
          flexDir={"column"}
          w={"60vw"}
          alignItems={"center"}
        >
          {isTitleValid ? (
            <InputText
              value={title}
              label="Title"
              placeholder="Enter review title"
              type="text"
              nome="text"
              onChange={(event) =>
                handleChangeGeneralDefinition("title", event.target.value)
              }
              labelAbove={true}
              isMainTitleField
              isSectionTitle 
            />
          ) : (
            <AlertInputText
              border="red"
              value={title}
              label="Title is required"
              placeholder="Enter review title"
              type="text"
              nome="text"
              onChange={(event) =>
                handleChangeGeneralDefinition("title", event.target.value)
              }
              labelAbove={true}
              isMainTitleField
              isSectionTitle
            />
          )}

          <TextAreaInput
            value={description}
            label="Description"
            placeholder="Enter review description"
            onChange={(event) =>
              handleChangeGeneralDefinition("description", event.target.value)
            }
            isSectionTitle
          />

          <TextAreaInput
            value={objectives}
            label="Objectives"
            placeholder="What are your goals?"
            onChange={(event) =>
              handleChangeGeneralDefinition("objectives", event.target.value)
            }
            isSectionTitle
          />

          <ResearcherFilter />

          <Box
            w={"60vw"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"end"}
          >
            {!isReturn ? (
              <NavButton event={handlePost} text="Create new Review" />
            ) : (
              <NavButton event={handlePut} text="Next" />
            )}
          </Box>
        </FormControl>
      </CardDefault>
    </FlexLayout>
  );
}
