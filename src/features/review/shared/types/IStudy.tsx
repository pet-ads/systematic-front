import { StudyType } from "./enums/studyType";
//import { CriteriaType } from "../enums/criteriaType";
import { ReadingPriority } from "./enums/readingPriority";
import { SelectionStatus } from "./enums/selectionStatus";
import { ExtractionStatus } from "./enums/extractionStatus";

export interface StudyInterface {
  studyId: number;
  systematicStudyId: number;
  studyType: StudyType;
  title: string;
  year: number;
  authors: string;
  venue: string;
  abstract: string;
  doi?: string | null;
  keywords: string[];
  searchSources: string[];
  references: string[];
  selectionCriteria: string[]
  extractionCriteria: string[];
  formAnswers: unknown[];
  robAnswers: unknown[];
  comments: string;
  readingPriority: ReadingPriority;
  selectionStatus: SelectionStatus;
  extractionStatus: ExtractionStatus;
}
