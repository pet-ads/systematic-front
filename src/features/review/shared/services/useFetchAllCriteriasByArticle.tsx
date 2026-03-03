// External library
import { useContext, useEffect, useState } from "react";

// Hooks
import useFetchCriteriaForFocusedArticle from "./useCriteriaForFocusedArticle";
import useFetchInclusionCriteria from "./useFetchInclusionCriteria";
import useFetchExclusionCriteria from "./useFetchExclusionCriterias";

// Types
import { PageLayout } from "../components/structure/LayoutFactory";
import useRevertCriterionState from "./useRevertCriterionState";
import StudyContext from "../context/StudiesContext";

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
};

export default function useFetchAllCriteriasByArticle({
  page,
}: AllCriteriasByArticleProps) {
  const [criterias, setCriterias] = useState<Record<number, CriteiriaProps>>(
    {},
  );

  const studiesContext = useContext(StudyContext);

  const selectedArticleReview = studiesContext?.selectedArticleReview ?? -1;

  const { criteria } = useFetchCriteriaForFocusedArticle({
    articleId: selectedArticleReview,
  });
  const inclusion = useFetchInclusionCriteria() || [];
  const exclusion = useFetchExclusionCriteria() || [];
  const { revertCriterionState } = useRevertCriterionState({ page });

  useEffect(() => {
    if (!inclusion || !exclusion || selectedArticleReview === -1) return;

    const groupOfCriteria: Record<OptionType, string[]> = {
      INCLUSION: criteria?.inclusionCriteria || [],
      EXCLUSION: criteria?.exclusionCriteria || [],
    };

    const inclusionMapped = inclusion.map((content) => ({
      text: content,
      isChecked: groupOfCriteria["INCLUSION"].includes(content),
    }));

    const inclusionStatus = inclusionMapped.some((crit) => crit.isChecked);

    const exclusionMapped = exclusion.map((content) => ({
      text: content,
      isChecked: groupOfCriteria["EXCLUSION"].includes(content),
    }));

    const exclusionStatus = exclusionMapped.some((crit) => crit.isChecked);

    setCriterias((prev) => ({
      ...prev,
      [selectedArticleReview]: {
        options: {
          INCLUSION: {
            content: inclusionMapped,
            isActive: inclusionStatus,
          },
          EXCLUSION: {
            content: exclusionMapped,
            isActive: exclusionStatus,
          },
        },
      },
    }));
  }, [inclusion, exclusion, selectedArticleReview, criteria]);

  const captureGroupOfCriteria = (current: CriteiriaProps, key: OptionType) => {
    const groupCriteria = current.options;
    const oppositeKey: OptionType =
      key === "INCLUSION" ? "EXCLUSION" : "INCLUSION";
    return { groupCriteria, oppositeKey };
  };

  function hasConflictWithOppositeGroup(
    groupCriteria: CriteiriaProps["options"],
    oppositeKey: OptionType,
  ) {
    return groupCriteria[oppositeKey].content.some((crit) => crit.isChecked);
  }

  function updateCriteriaContent(
    content: OptionProps[],
    optionText: string,
    newValue: boolean,
  ): { updatedContent: OptionProps[]; isNowActive: boolean } {
    const updated = content.map((crit) =>
      crit.text === optionText ? { ...crit, isChecked: newValue } : crit,
    );
    const isActive = updated.some((crit) => crit.isChecked);
    return { updatedContent: updated, isNowActive: isActive };
  }

  const shouldRevertState = (
    currentContent: OptionProps[],
    optionText: string,
    newValue: boolean,
  ) => {
    const criteria = currentContent.find((crit) => crit.text === optionText);
    if (!criteria) return;
    return criteria.isChecked === true && newValue === false;
  };

  const handlerUpdateCriteriasStructure = (
    key: OptionType,
    optionText: string,
    newValue: boolean,
  ) => {
    if (selectedArticleReview === -1) return;

    setCriterias((prev) => {
      const current = prev[selectedArticleReview];
      if (!current) return prev;

      const { groupCriteria, oppositeKey } = captureGroupOfCriteria(
        current,
        key,
      );
      if (!groupCriteria) return prev;

      if (
        newValue &&
        hasConflictWithOppositeGroup(groupCriteria, oppositeKey)
      ) {
        return prev;
      }

      const { updatedContent, isNowActive } = updateCriteriaContent(
        groupCriteria[key].content,
        optionText,
        newValue,
      );

      if (shouldRevertState(groupCriteria[key].content, optionText, newValue)) {
        revertCriterionState([optionText]);
      }

      return {
        ...prev,
        [selectedArticleReview]: {
          ...current,
          options: {
            ...groupCriteria,
            [key]: {
              content: updatedContent,
              isActive: isNowActive,
            },
          },
        },
      };
    });
  };

  const resetLocalCriterias = () => {
    if (selectedArticleReview === -1) return;

    setCriterias((prev) => {
      const current = prev[selectedArticleReview];
      if (!current) return prev;

      const resetContent = (content: OptionProps[]) =>
        content.map((c) => ({ ...c, isChecked: false }));

      return {
        ...prev,
        [selectedArticleReview]: {
          ...current,
          options: {
            INCLUSION: {
              content: resetContent(current.options.INCLUSION.content),
              isActive: false,
            },
            EXCLUSION: {
              content: resetContent(current.options.EXCLUSION.content),
              isActive: false,
            },
          },
        },
      };
    });
  };

  const CRITERIA_FALLBACK: CriteiriaProps = {
    options: {
      INCLUSION: { content: [], isActive: false },
      EXCLUSION: { content: [], isActive: false },
    },
  };

  return {
    criterias: criterias[selectedArticleReview] || CRITERIA_FALLBACK,
    handlerUpdateCriteriasStructure,
    resetLocalCriterias, 
  };
}
