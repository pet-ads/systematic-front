// External library
import { Select, FormControl } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export type SearchField = "title" | "authors" | "venue";

interface SearchFieldSelectProps {
  value: SearchField;
  onChange: (field: SearchField) => void;
  namespace: "review/execution-selection" | "review/execution-extraction";
}

export default function SearchFieldSelect({
  value,
  onChange,
  namespace,
}: SearchFieldSelectProps) {
  const { t } = useTranslation(namespace);

  const options: { value: SearchField; labelKey: string }[] = [
    { value: "title", labelKey: "searchField.title" },
    { value: "authors", labelKey: "searchField.authors" },
    { value: "venue", labelKey: "searchField.venue" },
  ];

  return (
    <FormControl w="10rem" flexShrink={0}>
      <Select
        bgColor="#EBF0F3"
        color="#2E4B6C"
        fontWeight="medium"
        value={value}
        onChange={(e) => onChange(e.target.value as SearchField)}
        borderRadius="md"
        size="md"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t(opt.labelKey)}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
