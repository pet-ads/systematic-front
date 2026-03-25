// External library
import { Box, Button, Flex } from "@chakra-ui/react";
import { MdOutlineLowPriority } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiResetLeftLine } from "react-icons/ri";
import { Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";

// Hooks
import useFetchAllCriteriasByArticle from "../../../../services/useFetchAllCriteriasByArticle";
import useResetStatus from "../../../../hooks/useResetStatus";
import useChangePriority from "../../../../services/useChangePriority";

// Components
import MenuOptions from "../../../../../../../components/common/menu/MenuOptions";
import ComboBox from "../../menu/ComboBox";

// Styles
import { boxconteiner, buttonconteiner, conteiner } from "./styles";

// Types
import ArticleInterface from "../../../../types/ArticleInterface";
import { StudyInterface } from "../../../../types/IStudy";
import { PageLayout } from "../../../structure/LayoutFactory";

import type {
  OptionProps,
  OptionType,
} from "../../../../services/useFetchAllCriteriasByArticle";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";

interface ButtonsForSelectionProps {
  page: PageLayout;
  articles: ArticleInterface[] | StudyInterface[];
  articleIndex: number;
  setSelectedArticleReview: React.Dispatch<React.SetStateAction<number>>;
  reloadArticles: KeyedMutator<SelectionArticles>;
}

export default function ButtonsForSelection({
  page,
  articles,
  articleIndex,
  setSelectedArticleReview,
  reloadArticles,
}: ButtonsForSelectionProps) {
  const { handleResetStatusToUnclassified } = useResetStatus({
    page,
    reloadArticles,
  });
  const { handleChangePriority } = useChangePriority({ reloadArticles });

  const currentArticle = articles[articleIndex];

  const getArticleId = (article: ArticleInterface | StudyInterface) => {
    if (!article) return undefined;
    return "studyReviewId" in article ? article.studyReviewId : article.studyId;
  };

  const currentArticleId = getArticleId(currentArticle);

  const {
    criterias: fetchedCriterias,
    handlerUpdateCriteriasStructure,
    resetLocalCriterias,
  } = useFetchAllCriteriasByArticle({ page });

  const [historicalCriteria, setHistoricalCriteria] = useState<string[]>([]);

  useEffect(() => {
    if (currentArticle) {
      setHistoricalCriteria(currentArticle.criteria || []);
    }
  }, [currentArticleId, page]);

  const handleFullReset = async () => {
    if (!currentArticleId) return;

    await handleResetStatusToUnclassified(currentArticleId, historicalCriteria);

    resetLocalCriterias();

    if (page === "Selection") {
      setHistoricalCriteria([]);
    }
  };

  if (!fetchedCriterias) return null;

  const currentArticleStatus = {
    selectionStatus: currentArticle.selectionStatus,
    extractionStatus: currentArticle.extractionStatus,
  };

  const criteriaOptions = fetchedCriterias.options;

  const criteriaGroupDataMap: Record<
    OptionType,
    { data: OptionProps[]; isActive: boolean }
  > = {
    INCLUSION: {
      data: criteriaOptions.INCLUSION.content,
      isActive: criteriaOptions.INCLUSION.isActive,
    },
    EXCLUSION: {
      data: criteriaOptions.EXCLUSION.content,
      isActive: criteriaOptions.EXCLUSION.isActive,
    },
  };

  if (!criteriaGroupDataMap["INCLUSION"] || !criteriaGroupDataMap["EXCLUSION"])
    return null;

  const isInclusionActive = criteriaOptions.INCLUSION.isActive;
  const isExclusionActive = criteriaOptions.EXCLUSION.isActive;

  const isUniqueArticle = articles.length == 1 ? true : false;

  function goToNextArticle() {
    const nextIndex = (articleIndex + 1) % articles.length;
    const nextArticle = articles[nextIndex];
    const nextId = getArticleId(nextArticle) as number;
    setSelectedArticleReview(nextId);
  }

  function goToPreviousArticle() {
    const prevIndex = (articleIndex - 1 + articles.length) % articles.length;
    const prevArticle = articles[prevIndex];
    const prevId = getArticleId(prevArticle) as number;
    setSelectedArticleReview(prevId);
  }

  const comboBoxGroups: Record<
    OptionType,
    {
      label: string;
      description: string;
      options: OptionProps[];
      isDisabled: boolean;
    }
  > = {
    INCLUSION: {
      label: "Include",
      description: "Add inclusion criteria",
      isDisabled:
        criteriaGroupDataMap["INCLUSION"].data.length === 0 ||
        isExclusionActive,
      options: criteriaGroupDataMap["INCLUSION"].data || [],
    },
    EXCLUSION: {
      label: "Exclude",
      description: "Add exclusion criteria",
      isDisabled:
        criteriaGroupDataMap["EXCLUSION"].data.length === 0 ||
        isInclusionActive,
      options: criteriaGroupDataMap["EXCLUSION"].data || [],
    },
  };

  return (
    <Flex
      sx={conteiner}
      justifyContent={isUniqueArticle ? "center" : "space-between"}
    >
      {isUniqueArticle ? null : (
        <Flex sx={buttonconteiner}>
          <Tooltip
            label="Previous article"
            placement="top"
            hasArrow
            p=".5rem"
            borderRadius=".25rem"
          >
            <Box style={{ display: "inline-block" }}>
              <IoIosArrowBack
                color="black"
                size="1.5rem"
                onClick={goToPreviousArticle}
                cursor="pointer"
              />
            </Box>
          </Tooltip>
        </Flex>
      )}
      <Flex sx={boxconteiner}>
        {Object.entries(comboBoxGroups).map(([groupKey, group]) => (
          <Tooltip
            key={groupKey}
            label={group.description}
            placement="top"
            hasArrow
            p=".5rem"
            borderRadius=".25rem"
          >
            <Box style={{ display: "inline-block" }}>
              <ComboBox
                page={page}
                text={group.label}
                status={currentArticleStatus}
                groupKey={groupKey as OptionType}
                options={group.options}
                isDisabled={group.isDisabled}
                handlerUpdateCriteriasStructure={
                  handlerUpdateCriteriasStructure
                }
                reloadArticles={reloadArticles}
                selectedCriteria={historicalCriteria}
              />
            </Box>
          </Tooltip>
        ))}
        <Tooltip
          label="Reset article"
          placement="top"
          hasArrow
          p=".5rem"
          borderRadius=".25rem"
        >
          <Button color="black" bg="white" p="1rem" onClick={handleFullReset}>
            <RiResetLeftLine color="black" size="1.5rem" />
          </Button>
        </Tooltip>

        <Tooltip
          label="Select reading priority"
          placement="top"
          hasArrow
          p=".5rem"
          borderRadius=".25rem"
        >
          <Box style={{ display: "inline-block" }}>
            <MenuOptions
              options={["Very Low", "Low", "High", "Very High"]}
              onOptionToggle={(option) =>
                handleChangePriority({ status: option })
              }
              icon={<MdOutlineLowPriority color="black" size="1.75rem" />}
            />
          </Box>
        </Tooltip>
      </Flex>

      {isUniqueArticle ? null : (
        <Flex sx={buttonconteiner}>
          <Tooltip
            label="Next article"
            placement="top"
            hasArrow
            p=".5rem"
            borderRadius=".25rem"
          >
            <Box style={{ display: "inline-block" }}>
              <IoIosArrowForward
                color="black"
                size="1.5rem"
                onClick={goToNextArticle}
                cursor="pointer"
              />
            </Box>
          </Tooltip>
        </Flex>
      )}
    </Flex>
  );
}
