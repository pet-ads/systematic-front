import {
  // IconButton,
  Flex,
  Text,
  // Center,
  // useDisclosure,
} from "@chakra-ui/react";
import { StudyInterface } from "../../../../public/interfaces/IStudy";
import { PageLayout } from "../../../pages/Execution/Selection/subcomponents/LayoutFactory";
import ArticlePreview from "./ArticlePreview";
import ArticlesExtrationData from "./ArticleExtractionData";

interface IStudyDataFiel {
  studyData: StudyInterface;
  page: PageLayout;
}

export interface ArticlePreviewProps {
  studyData: StudyInterface;
}

export default function StudyDataFiel({ studyData, page }: IStudyDataFiel) {
  // const isTypeValid: boolean = type === "Selection" || type === "Extraction";
  // const isTypeSelection: boolean = type === "Selection";

  const selectionSX = {
    bg: "white",
    width: "100%",
    height: "90%",
    flexDirection: "column",
    alignContent: "center",
    overflowY: "scroll",
    padding: "3",
  };

  return page.type === "Selection" ? (
    <Flex sx={selectionSX}>
      <ArticlePreview studyData={studyData} />
    </Flex>
  ) : (
    <Flex sx={selectionSX}>
      <ArticlesExtrationData studyData={studyData} />
    </Flex>
  );
}
