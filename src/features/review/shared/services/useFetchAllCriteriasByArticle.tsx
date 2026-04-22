import { useContext, useEffect, useState } from "react";

import useFetchCriteriaForFocusedArticle from "./useCriteriaForFocusedArticle";
import useFetchInclusionCriteria from "./useFetchInclusionCriteria";
import useFetchExclusionCriteria from "./useFetchExclusionCriterias";
import useRevertCriterionState from "./useRevertCriterionState";

import { PageLayout } from "../components/structure/LayoutFactory";
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

const criteriaStateCache: Record<string, CriteiriaProps> = {};

export default function useFetchAllCriteriasByArticle({
  page,
}: AllCriteriasByArticleProps) {
  const [criterias, setCriterias] =
    useState<Record<string, CriteiriaProps>>(criteriaStateCache);

  const studiesContext = useContext(StudyContext);
  const selectedArticleReview = studiesContext?.selectedArticleReview ?? -1;

  const stateKey = `${selectedArticleReview}_${page}`;

  const { criteria } = useFetchCriteriaForFocusedArticle({
    articleId: selectedArticleReview,
  });

  const inclusion = useFetchInclusionCriteria() || [];
  const exclusion = useFetchExclusionCriteria() || [];
  const { revertCriterionState } = useRevertCriterionState({ page });

  useEffect(() => {
    Object.assign(criteriaStateCache, criterias);
  }, [criterias]);

  useEffect(() => {
    if (!inclusion || !exclusion || selectedArticleReview === -1) return;
    if (inclusion.length === 0 && exclusion.length === 0) return;
    
    setCriterias((prev) => {
      const groupOfCriteria: Record<OptionType, string[]> = {
        INCLUSION: criteria?.inclusionCriteria || [],
        EXCLUSION: criteria?.exclusionCriteria || [],
      };

      const inclusionMapped = inclusion.map((content) => ({
        text: content,
        isChecked: groupOfCriteria["INCLUSION"].includes(content),
      }));

      const exclusionMapped = exclusion.map((content) => ({
        text: content,
        isChecked: groupOfCriteria["EXCLUSION"].includes(content),
      }));

      const inclusionStatus = inclusionMapped.some((crit) => crit.isChecked);
      const exclusionStatus = exclusionMapped.some((crit) => crit.isChecked);

      return {
        ...prev,
        [stateKey]: {
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
      };
    });
  }, [inclusion, exclusion, selectedArticleReview, criteria, stateKey]);

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
    return groupCriteria[oppositeKey].content.some(
      (crit: OptionProps) => crit.isChecked,
    );
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
      const current = prev[stateKey];
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
        [stateKey]: {
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
      const current = prev[stateKey];
      if (!current) return prev;

      const resetContent = (content: OptionProps[]) =>
        content.map((c) => ({ ...c, isChecked: false }));

      const resetState: CriteiriaProps = {
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
      };

      criteriaStateCache[stateKey] = resetState;

      return {
        ...prev,
        [stateKey]: resetState,
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
    criterias: criterias[stateKey] || CRITERIA_FALLBACK,
    handlerUpdateCriteriasStructure,
    resetLocalCriterias,
  };
}
