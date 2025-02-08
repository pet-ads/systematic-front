import { useContext } from "react";
import StudySelectionContext from "../components/Context/StudiesSelectionContext";
import AppContext from "../components/Context/AppContext";
import { UseChangeStudySelectionStatus } from "./useChangeStudySelectionStatus";
import { UseChangeStudyExtractionStatus } from "./useChangeStudyExtractionStatus";
import { PageLayout } from "../pages/Execution/Selection/subcomponents/LayoutFactory";

interface ComboBoxSelectionProps{
  page: PageLayout,
}

const useComboBoxSelection = ({page}: ComboBoxSelectionProps) => {
  const selectionContext = useContext(StudySelectionContext);
  const appContext = useContext(AppContext);
  const setIsIncluded = selectionContext?.setIsIncluded;
  const setIsExcluded = selectionContext?.setIsExcluded;

  const handleIncludeItemClick = (isChecked: boolean, criterion: {description: String, type: String}) => {
    if(setIsIncluded) setIsIncluded(isChecked);
    const articles = selectionContext?.articles;
    const articleIndex = appContext?.selectionStudyIndex;
    
    if(articles && articleIndex){
      const studyReviewId = articles[articleIndex].studyReviewId;
      page.type === "Selection" ? UseChangeStudySelectionStatus({studyReviewId, status: 'INCLUDED', criterion}) : UseChangeStudyExtractionStatus({studyReviewId, status: 'INCLUDED'})
    }
  };

  const handleExcludeItemClick = (isChecked: boolean, criterion: {description: String, type: String}) => {
    if(setIsExcluded) setIsExcluded(isChecked);
    const articles = selectionContext?.articles;
    const articleIndex = appContext?.selectionStudyIndex;
    
    if(articles && articleIndex){
      const studyReviewId = articles[articleIndex].studyReviewId;
      page.type === "Selection" ? UseChangeStudySelectionStatus({studyReviewId, status: 'EXCLUDED', criterion}) : UseChangeStudyExtractionStatus({studyReviewId, status: 'EXCLUDED'})
    }
  }

  return { handleIncludeItemClick, handleExcludeItemClick };
};

export default useComboBoxSelection;
