// External library
import { useContext, useMemo } from "react";
import type { KeyedMutator } from "swr";

// Hooks
import useFetchCriteriaForFocusedArticle from "./useCriteriaForFocusedArticle";
import useFetchInclusionCriteria from "./useFetchInclusionCriteria";
import useFetchExclusionCriteria from "./useFetchExclusionCriterias";
import useRevertCriterionState from "./useRevertCriterionState";
import useToaster from "@components/feedback/Toaster";

// Services
import { UseChangeStudySelectionStatus } from "./useChangeStudySelectionStatus";
import { UseChangeStudyExtractionStatus } from "./useChangeStudyExtractionStatus";

// Types
import { PageLayout } from "../components/structure/LayoutFactory";
import StudyContext from "../context/StudiesContext";
import type { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";

export type OptionType = "INCLUSION" | "EXCLUSION";

export type OptionProps = {
  text: string;
  isChecked: boolean;
};

export type CriteiriaProps = {
  options: Record<
    OptionType,
    {
      content: OptionProps[];
      isActive: boolean;
    }
  >;
};

type AllCriteriasByArticleProps = {
  page: PageLayout;
  reloadArticles?: KeyedMutator<SelectionArticles>;
};

type StatusValue = "INCLUDED" | "EXCLUDED" | "UNCLASSIFIED";

const OPTION_TO_GET_KEY: Record<
  OptionType,
  "inclusionCriteria" | "exclusionCriteria"
> = {
  INCLUSION: "inclusionCriteria",
  EXCLUSION: "exclusionCriteria",
};

const CRITERIA_FALLBACK: CriteiriaProps = {
  options: {
    INCLUSION: { content: [], isActive: false },
    EXCLUSION: { content: [], isActive: false },
  },
};

export default function useFetchAllCriteriasByArticle({
  page,
  reloadArticles,
}: AllCriteriasByArticleProps) {
  const studiesContext = useContext(StudyContext);
  const selectedArticleReview = studiesContext?.selectedArticleReview ?? -1;
  const toast = useToaster();

  const { criteria, mutate } = useFetchCriteriaForFocusedArticle({
    articleId: selectedArticleReview,
  });

  const inclusion = useFetchInclusionCriteria() || [];
  const exclusion = useFetchExclusionCriteria() || [];
  const { revertCriterionState } = useRevertCriterionState({ page });

  const criterias = useMemo<CriteiriaProps>(() => {
    const checkedInclusion = criteria?.inclusionCriteria || [];
    const checkedExclusion = criteria?.exclusionCriteria || [];

    const inclusionMapped: OptionProps[] = inclusion.map((text) => ({
      text,
      isChecked: checkedInclusion.includes(text),
    }));

    const exclusionMapped: OptionProps[] = exclusion.map((text) => ({
      text,
      isChecked: checkedExclusion.includes(text),
    }));

    return {
      options: {
        INCLUSION: {
          content: inclusionMapped,
          isActive: inclusionMapped.some((c) => c.isChecked),
        },
        EXCLUSION: {
          content: exclusionMapped,
          isActive: exclusionMapped.some((c) => c.isChecked),
        },
      },
    };
  }, [inclusion, exclusion, criteria]);

  const handlerUpdateCriteriasStructure = async (
    key: OptionType,
    optionText: string,
    newValue: boolean,
  ) => {
    if (selectedArticleReview === -1) return;

    const oppositeKey: OptionType =
      key === "INCLUSION" ? "EXCLUSION" : "INCLUSION";
    const currentChecked = criteria?.[OPTION_TO_GET_KEY[key]] || [];
    const oppositeChecked = criteria?.[OPTION_TO_GET_KEY[oppositeKey]] || [];

    const newChecked = newValue
      ? [...currentChecked, optionText]
      : currentChecked.filter((c) => c !== optionText);

    const newOppositeChecked = newValue ? [] : oppositeChecked;

    const optimisticData = {
      inclusionCriteria:
        key === "INCLUSION" ? newChecked : newOppositeChecked,
      exclusionCriteria:
        key === "EXCLUSION" ? newChecked : newOppositeChecked,
    };

    const status: StatusValue =
      newChecked.length === 0
        ? "UNCLASSIFIED"
        : key === "INCLUSION"
          ? "INCLUDED"
          : "EXCLUDED";

    try {
      await mutate(
        async () => {
          if (page === "Selection") {
            const extractionStatus: StatusValue = status;

            await UseChangeStudyExtractionStatus({
              studyReviewId: [selectedArticleReview],
              criterias: status === "EXCLUDED" ? newChecked : [],
              status: extractionStatus,
            });

            await UseChangeStudySelectionStatus({
              studyReviewId: [selectedArticleReview],
              criterias: newChecked,
              status,
            });
          } else {
            await UseChangeStudyExtractionStatus({
              studyReviewId: [selectedArticleReview],
              criterias: newChecked,
              status,
            });
          }

          if (!newValue) {
            await revertCriterionState([optionText]);
          } else if (oppositeChecked.length > 0) {
            await revertCriterionState(oppositeChecked);
          }

          if (reloadArticles) await reloadArticles();

          return optimisticData;
        },
        {
          optimisticData,
          rollbackOnError: true,
          revalidate: false,
        },
      );
    } catch (error) {
      console.error("Failed to update criterion:", error);
      toast({
        title: "Erro ao salvar critério",
        description:
          "Não foi possível atualizar este critério. Tente novamente.",
        status: "error",
      });
    }
  };

  const resetLocalCriterias = async () => {
    if (selectedArticleReview === -1) return;
    
    await mutate(
      (currentData: any) => ({
        ...currentData,
        inclusionCriteria: [],
        exclusionCriteria: [],
      }),
      { revalidate: false }
    );
  };

  return {
    criterias: criterias || CRITERIA_FALLBACK,
    handlerUpdateCriteriasStructure,
    resetLocalCriterias,
  };
}