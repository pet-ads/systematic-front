import { useContext } from "react";
import { Button, Flex } from "@chakra-ui/react";

import StudySelectionContext from "@features/review/shared/context/StudiesSelectionContext";
import { UseChangeStudySelectionStatus } from "../../../../services/useChangeStudySelectionStatus";
import useSendDuplicatedStudies from "../../../../services/useSendDuplicatedStudies";
import { FaCheckCircle, FaEye, FaTrashAlt } from "react-icons/fa";
import { MdOutlineCleaningServices } from "react-icons/md";

const buttonSX = {
  display: "flex",
  borderRadius: ".25rem",
  gap: ".25rem",
  justifyContent: "center",
  alignItems: "center",
  transition: "0.3s ease-in-out",
  p: "0 1rem",
  w: "100%",
  h: "2.5rem",
  color: "#263C56",
};

interface ButtonsForMultipleSelectionProps {
  onShowSelectedArticles: (showSelected: boolean) => void;
  isShown: boolean;
}

export default function ButtonsForMultipleSelection({
  onShowSelectedArticles,
  isShown,
}: ButtonsForMultipleSelectionProps) {
  const studyContext = useContext(StudySelectionContext);

  const duplicatedStudies = studyContext?.deletedArticles.filter(
    (art) => art != studyContext?.firstSelected
  );

  const { sendDuplicatedStudies } = useSendDuplicatedStudies({
    firstSelected: studyContext?.firstSelected || 0,
    duplicatedStudies: duplicatedStudies || [],
  });

  const articles = studyContext?.selectedArticles;

  const handleSendDuplicatedStudies = () => {
    sendDuplicatedStudies();
    studyContext?.clearSelectedArticles();
    onShowSelectedArticles(false);
  };

  const handleSendExcludedStudies = () => {
    if (!articles || Object.keys(articles).length <= 1) return;
    UseChangeStudySelectionStatus({
      status: "EXCLUDED",
      studyReviewId: [...Object.values(articles).map((art) => art.id)],
      criterias: [],
    });
    studyContext?.clearSelectedArticles();
    onShowSelectedArticles(false);
  };

  return articles && Object.keys(articles).length > 1 ? (
    <Flex gap=".5rem">
      {!isShown ? (
        <Button
          sx={buttonSX}
          bg="#EBF0F3"
          _hover={{ bg: "white", color: "#263C56", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}
          transition="0.1s ease-in-out"
          onClick={() => {
            onShowSelectedArticles(!isShown);
          }}
          leftIcon={<FaEye color="green" />}
        >
          Show selected
        </Button>
      ) : (
        <Button
          sx={buttonSX}
          bg="#EBF0F3"
          _hover={{ bg: "white", color: "#263C56", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}
          transition="0.2s ease-in-out"
          onClick={() => {
            onShowSelectedArticles(!isShown);
          }}
          leftIcon={<FaEye color="green" />}
        >
          Show all
        </Button>
      )}

      <Button
        sx={buttonSX}
        bg="#EBF0F3"
        _hover={{ bg: "white", color: "#263C56", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}
        transition="0.2s ease-in-out"
        onClick={handleSendDuplicatedStudies}
        leftIcon={<FaCheckCircle color="blue"/>}
      >
        Mark as duplicated
      </Button>
      <Button
        sx={buttonSX}
        bg="#EBF0F3"
        _hover={{ bg: "white", color: "#263C56", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}
        transition="0.2s ease-in-out"
        onClick={handleSendExcludedStudies}
        leftIcon={<FaTrashAlt color="red"/>}
      >
        Mark as excluded
      </Button>
      <Button
        sx={buttonSX}
        bg="#EBF0F3"
        _hover={{ bg: "white", color: "#263C56", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}
        transition="0.2s ease-in-out"
        onClick={() => {
          studyContext.clearSelectedArticles();
          onShowSelectedArticles(false);
        }}
        leftIcon={<MdOutlineCleaningServices color="orange"/>}
      >
        Clear selection
      </Button>
    </Flex>
  ) : null;
}
