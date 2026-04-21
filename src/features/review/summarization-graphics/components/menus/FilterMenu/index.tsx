import { NumberInput, NumberInputField, Flex } from "@chakra-ui/react";
import CheckboxDropdown from "@features/review/summarization-graphics/components/menus/CheckBoxDropDown";
import useFetchDataBases from "@features/review/shared/services/useFetchDataBases";
import useFetchInclusionCriteria from "@features/review/shared/services/useFetchInclusionCriteria";
import { FiltersState } from "@features/review/summarization-graphics/hooks/useGraphicsState";
import React from "react";
import { useTranslation } from "react-i18next";

export type FilterType = "Start Year" | "End Year" | "Source" | "Criteria";

type InlineFiltersProps = {
  availableFilters: FilterType[];
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
};

export default function FiltersMenu({
  availableFilters,
  filters,
  setFilters,
}: InlineFiltersProps) {
  const { databases = [] } = useFetchDataBases();
  const inclusionCriterias = useFetchInclusionCriteria() || [];
  const { t } = useTranslation("review/summarization-graphics");


  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      source:
        availableFilters.includes("Source") &&
        (!prev.source || prev.source.length === 0)
          ? databases
          : prev.source,
      criteria:
        availableFilters.includes("Criteria") &&
        (!prev.criteria || prev.criteria.length === 0)
          ? inclusionCriterias
          : prev.criteria,
    }));
  }, [databases, inclusionCriterias]);

  return (
    <Flex wrap="wrap" gap="1rem" alignItems="center">
      {availableFilters.includes("Source") && (
        <CheckboxDropdown
          label={t("filtersArea.sources")}
          options={databases}
          selected={filters.source || []}
          onToggle={(clickedSource: string) => {
            setFilters((prevFilters) => {
              const selectedSources = prevFilters.source || [];
              const isSelected = selectedSources.includes(clickedSource);

              const updatedSources = isSelected
                ? selectedSources.filter((source) => source !== clickedSource)
                : [...selectedSources, clickedSource];

              return {
                ...prevFilters,
                source: updatedSources,
              };
            });
          }}
        />
      )}

      {availableFilters.includes("Criteria") && (
        <CheckboxDropdown
          label={t("filtersArea.criteria")}
          options={inclusionCriterias}
          selected={filters.criteria || []}
          onToggle={(clickedCriteria: string) => {
            setFilters((prevFilters: FiltersState) => {
              const selectedCriteria = prevFilters.criteria || [];
              const updatedCriteria = selectedCriteria.includes(clickedCriteria)
                ? selectedCriteria.filter(
                    (criteria) => criteria !== clickedCriteria
                  )
                : [...selectedCriteria, clickedCriteria];
              return {
                ...prevFilters,
                criteria: updatedCriteria,
              };
            });
          }}
        />
      )}

      {availableFilters.includes("Start Year") && (
        <NumberInput
          min={1900}
          max={2100}
          w="180px"
          value={filters.startYear ?? ""}
          onChange={(_, n) =>
            setFilters((prev: FiltersState) => ({
              ...prev,
              startYear: isNaN(n) ? undefined : n,
            }))
          }
        >
          <NumberInputField placeholder={t("filtersArea.startYear")} bg="white" />
        </NumberInput>
      )}

      {availableFilters.includes("End Year") && (
        <NumberInput
          min={1900}
          max={2100}
          w="180px"
          value={filters.endYear ?? ""}
          onChange={(_, n) =>
            setFilters((prev: FiltersState) => ({
              ...prev,
              endYear: isNaN(n) ? undefined : n,
            }))
          }
        >
          <NumberInputField placeholder={t("filtersArea.endYear")} bg="white" />
        </NumberInput>
      )}
    </Flex>
  );
}
