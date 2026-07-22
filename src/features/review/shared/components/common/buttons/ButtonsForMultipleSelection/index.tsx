import { SetStateAction, useContext } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import StudyContext from "@features/review/shared/context/StudiesContext";
import useSendDuplicatedStudies from "../../../../services/useSendDuplicatedStudies";
import { FaCheckCircle, FaEye } from "react-icons/fa";
import { MdOutlineCleaningServices } from "react-icons/md";
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

const buttonSX = {
  display: "flex",
  borderRadius: ".25rem",
  gap: ".25rem",
  justifyContent: "center",
  alignItems: "center",
  transition: "0.3s ease-in-out",
  p: "0 1rem",
  h: "2.5rem",
  color: "#263C56",
};

interface ButtonsForMultipleSelectionProps {
  onShowSelectedArticles: (showSelected: boolean) => void;
  isShown: boolean;
  reloadArticles: () => Promise<any>;
  setIsMultipleSelectionEnable: React.Dispatch<SetStateAction<boolean>>;
}

export default function ButtonsForMultipleSelection({
  onShowSelectedArticles,
  isShown,
  reloadArticles,
  setIsMultipleSelectionEnable
}: ButtonsForMultipleSelectionProps) {
  const window = useWindowWidth();
  const studyContext = useContext(StudyContext);
  const { t } = useTranslation("review/execution-selection");

  const duplicatedStudies = studyContext?.deletedArticles.filter(
    (art) => art != studyContext?.firstSelected
  );

  const { sendDuplicatedStudies } = useSendDuplicatedStudies({
    firstSelected: studyContext?.firstSelected || 0,
    duplicatedStudies: duplicatedStudies || [],
  });

  const articles = studyContext?.selectedArticles;

  if(articles && Object.keys(articles).length > 1){
    setIsMultipleSelectionEnable(true);
  } else {
    setIsMultipleSelectionEnable(false);
  }

  const handleSendDuplicatedStudies = async () => {
    await sendDuplicatedStudies();
    await reloadArticles();

    studyContext?.clearSelectedArticles();
    onShowSelectedArticles(false);
  };

  return articles && Object.keys(articles).length > 1 ? (
    <Flex gap={window > 1400 ? ".5rem" : ".2rem"} flexDirection={window > 1400 ? "row" : "column"}>
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
            {t("buttonsForMultipleSelection.showSelected")}
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
            {t("buttonsForMultipleSelection.showAll")}
          </Button>
        )
      }

      <Button
        sx={buttonSX}
        bg="#EBF0F3"
        _hover={{ bg: "white", color: "#263C56", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}
        transition="0.2s ease-in-out"
        onClick={handleSendDuplicatedStudies}
        leftIcon={<FaCheckCircle color="blue"/>}
      >
        {t("buttonsForMultipleSelection.markAsDuplicated")}
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
        {t("buttonsForMultipleSelection.clearSelection")}
      </Button>
    </Flex>
  ) : null;
}
