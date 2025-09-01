// External libraries
import { useMemo } from "react";

// Components
import SelectInput from "@components/common/inputs/SelectInput";

// Types
import ArticleInterface from "@features/review/shared/types/ArticleInterface";

interface StatusSelectProps {
  articles: ArticleInterface[];
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  type: "selection" | "extraction";
  placeholder?: string;
}

export default function StatusSelect({
  articles,
  value,
  setValue,
  type,
  placeholder,
}: StatusSelectProps) {
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      INCLUDED: 0,
      DUPLICATED: 0,
      EXCLUDED: 0,
      UNCLASSIFIED: 0,
    };

    articles.forEach((article) => {
      const statusKey =
        type === "selection"
          ? article.selectionStatus
          : article.extractionStatus;

      if (statusKey && counts[statusKey] !== undefined) {
        counts[statusKey] += 1;
      }
    });

    return counts;
  }, [articles, type]);

  const statusOptions = [
    { value: "INCLUDED", label: `Included ${statusCounts.INCLUDED}` },
    { value: "DUPLICATED", label: `Duplicated ${statusCounts.DUPLICATED}` },
    { value: "EXCLUDED", label: `Excluded ${statusCounts.EXCLUDED}` },
    { value: "UNCLASSIFIED", label: `Unclassified ${statusCounts.UNCLASSIFIED}` },
  ];

  return (
    <SelectInput
      names={statusOptions.map((opt) => opt.label)}
      values={statusOptions.map((opt) => opt.value)}
      onSelect={(v) => setValue(v)}
      selectedValue={value}
      page={type}
      placeholder={placeholder}
    />
  );
}