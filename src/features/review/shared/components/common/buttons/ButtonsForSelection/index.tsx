// External library
import { Box, Button, Flex } from "@chakra-ui/react";
import { MdOutlineLowPriority } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiResetLeftLine } from "react-icons/ri";
import { Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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

// Services
import { UseChangeStudyExtractionStatus } from "../../../../services/useChangeStudyExtractionStatus";

interface ButtonsForSelectionProps {
  page: PageLayout;
  articles: ArticleInterface[] | StudyInterface[];
  articleIndex: number;
  setSelectedArticleReview: React.Dispatch<React.SetStateAction<number>>;
  reloadArticles: KeyedMutator<SelectionArticles>;
  isLastPage: boolean;
  isFirstPage: boolean;
  onFetchNextPage: () => Promise<ArticleInterface[]>;
  onFetchPrevPage: () => Promise<ArticleInterface[]>;
  onWrapToLast: () => Promise<ArticleInterface[]>;
  onWrapToFirst: () => ArticleInterface[];
}

type ComboBoxGroup = {
  label: string;
  description: string;
  options: OptionProps[];
  isDisabled: boolean;
};

export default function ButtonsForSelection({
  page,
  articles,
  articleIndex,
  setSelectedArticleReview,
  reloadArticles,
  isLastPage,
  isFirstPage,
  onFetchNextPage,
  onFetchPrevPage,
  onWrapToLast,
  onWrapToFirst,
}: ButtonsForSelectionProps) {
  const { handleResetStatusToUnclassified } = useResetStatus({
    page,
    reloadArticles,
  });
  const { handleChangePriority } = useChangePriority({ reloadArticles });
  const { t } = useTranslation("review/execution-selection");

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

  const currentArticleStatus = {
    selectionStatus: currentArticle?.selectionStatus,
    extractionStatus: currentArticle?.extractionStatus,
  };

  const isBlockedByExtraction =
    page === "Selection" &&
    currentArticleStatus.selectionStatus === "INCLUDED" &&
    currentArticleStatus.extractionStatus !== undefined &&
    currentArticleStatus.extractionStatus !== "UNCLASSIFIED";

  const handleFullReset = async () => {
    if (!currentArticleId || isBlockedByExtraction) return;

    if (currentArticleStatus.extractionStatus !== "UNCLASSIFIED") {
      try {
        await UseChangeStudyExtractionStatus({
          studyReviewId: [currentArticleId],
          status: "UNCLASSIFIED",
          criterias: [],
        });
      } catch (error) {
        console.error("Error resetting extraction status", error);
      }
    }

    await handleResetStatusToUnclassified(currentArticleId, historicalCriteria);
    resetLocalCriterias();
    if (page === "Selection") {
      setHistoricalCriteria([]);
    }
  };

  if (!fetchedCriterias) return null;

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
  const isUniqueArticle = articles.length === 1;

  async function goToNextArticle() {
    const isLastArticleOnPage = articleIndex === articles.length - 1;

    if (isLastArticleOnPage && !isLastPage) {
      const nextPageArticles = await onFetchNextPage();
      if (nextPageArticles.length > 0) {
        setSelectedArticleReview(getArticleId(nextPageArticles[0]) as number);
      }
      return;
    }

    if (isLastArticleOnPage && isLastPage) {
      const firstPageArticles = onWrapToFirst();
      if (firstPageArticles.length > 0) {
        setSelectedArticleReview(getArticleId(firstPageArticles[0]) as number);
      }
      return;
    }

    const nextIndex = (articleIndex + 1) % articles.length;
    setSelectedArticleReview(getArticleId(articles[nextIndex]) as number);
  }

  async function goToPreviousArticle() {
    const isFirstArticleOnPage = articleIndex === 0;

    if (isFirstArticleOnPage && !isFirstPage) {
      const prevPageArticles = await onFetchPrevPage();
      if (prevPageArticles.length > 0) {
        const last = prevPageArticles[prevPageArticles.length - 1];
        setSelectedArticleReview(getArticleId(last) as number);
      }
      return;
    }

    if (isFirstArticleOnPage && isFirstPage) {
      const lastPageArticles = await onWrapToLast();
      if (lastPageArticles.length > 0) {
        const last = lastPageArticles[lastPageArticles.length - 1];
        setSelectedArticleReview(getArticleId(last) as number);
      }
      return;
    }

    const prevIndex = (articleIndex - 1 + articles.length) % articles.length;
    setSelectedArticleReview(getArticleId(articles[prevIndex]) as number);
  }

  const comboBoxGroups: Record<OptionType, ComboBoxGroup> = {
    INCLUSION: {
      label: "Include",
      description: isBlockedByExtraction
        ? "Article already classified in Extraction"
        : criteriaGroupDataMap["INCLUSION"].data.length === 0
          ? "No inclusion criteria configured in Planning"
          : isExclusionActive
            ? "Remove exclusion criteria first"
            : t("buttonsForSelection.tooltips.includeDescription"),
      isDisabled:
        isBlockedByExtraction ||
        criteriaGroupDataMap["INCLUSION"].data.length === 0 ||
        isExclusionActive,
      options: criteriaGroupDataMap["INCLUSION"].data,
    },
    EXCLUSION: {
      label: "Exclude",
      description: isBlockedByExtraction
        ? "Article already classified in Extraction"
        : criteriaGroupDataMap["EXCLUSION"].data.length === 0
          ? "No exclusion criteria configured in Planning"
          : isInclusionActive
            ? "Remove inclusion criteria first"
            : t("buttonsForSelection.tooltips.excludeDescription"), 
      isDisabled:
        isBlockedByExtraction ||
        criteriaGroupDataMap["EXCLUSION"].data.length === 0 ||
        isInclusionActive,
      options: criteriaGroupDataMap["EXCLUSION"].data,
    },
  };

  return (
    <Flex
      sx={conteiner}
      justifyContent={isUniqueArticle ? "center" : "space-between"}
    >
      {!isUniqueArticle && (
        <Flex sx={buttonconteiner}>
          <Tooltip
            label={t("buttonsForSelection.tooltips.previousArticle")}
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
        {(Object.entries(comboBoxGroups) as [OptionType, ComboBoxGroup][]).map(
          ([groupKey, group]) => (
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
                  groupKey={groupKey}
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
          ),
        )}

        <Tooltip
          label={
            isBlockedByExtraction
              ? "Article already classified in Extraction"
              : t("buttonsForSelection.tooltips.resetArticle")
          }
          placement="top"
          hasArrow
          p=".5rem"
          borderRadius=".25rem"
        >
          <Box style={{ display: "inline-block" }}>
            <Button
              color="black"
              bg="white"
              p="1rem"
              onClick={handleFullReset}
              isDisabled={isBlockedByExtraction}
            >
              <RiResetLeftLine color="black" size="1.5rem" />
            </Button>
          </Box>
        </Tooltip>

        <Tooltip
          label={t("buttonsForSelection.tooltips.selectPriority")}
          placement="top"
          hasArrow
          p=".5rem"
          borderRadius=".25rem"
        >
          <Box style={{ display: "inline-block" }}>
            <MenuOptions
              options={[
                t("buttonsForSelection.priorityOptions.veryLow"),
                t("buttonsForSelection.priorityOptions.low"),
                t("buttonsForSelection.priorityOptions.high"),
                t("buttonsForSelection.priorityOptions.veryHigh"),
              ]}
              onOptionToggle={(option) =>
                handleChangePriority({ status: option })
              }
              icon={<MdOutlineLowPriority color="black" size="1.75rem" />}
            />
          </Box>
        </Tooltip>
      </Flex>

      {!isUniqueArticle && (
        <Flex sx={buttonconteiner}>
          <Tooltip
            label={t("buttonsForSelection.tooltips.nextArticle")}
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
