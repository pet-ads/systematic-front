import { Flex } from "@chakra-ui/react";

import ArticlePreview from "../ArticlePreview";

import { PageLayout } from "@features/review/shared/components/structure/LayoutFactory";
import ExtractionForm from "@features/review/execution-extraction/components/forms/ExtractionForm";
import { StudyInterface } from "@features/review/shared/types/IStudy";

export interface EditData {
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract: string;
  keywords: string;
}

interface IStudyDataFiel {
  studyData: StudyInterface;
  page: PageLayout;
  isEditing?: boolean;
  editData?: EditData;
  setEditData?: (data: EditData) => void;
}

export interface ArticlePreviewProps {
  studyData: StudyInterface;
  mode?: "selection" | "extraction";
  isEditing?: boolean;
  editData?: EditData;
  setEditData?: (data: EditData) => void;
}

export default function StudyDataFiel({
  studyData,
  page,
  isEditing,
  editData,
  setEditData,
}: IStudyDataFiel) {
  const selectionSX = {
    bg: "white",
    w: "100%",
    h: "100%",
    flexDirection: "column",
    alignContent: "center",
    overflowY: "scroll",
    padding: "3",
  };

  return (
    <Flex sx={selectionSX}>
      {page == "Selection" || page == "Identification" ? (
        <ArticlePreview
          studyData={studyData}
          mode="selection"
          isEditing={isEditing}
          editData={editData}
          setEditData={setEditData}
        />
      ) : (
        <ExtractionForm studyData={studyData} mode="extraction" />
      )}
    </Flex>
  );
}