// External library
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Tooltip, FormControl } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BsSliders } from "react-icons/bs";

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
    <FormControl w="auto" flexShrink={0}>
      <Menu isLazy>
        <Tooltip label={t("searchFieldTooltip")} aria-label={t("searchFieldTooltip")} hasArrow>
          <MenuButton
            as={IconButton}
            aria-label={t("searchFieldTooltip")}
            icon={<BsSliders size="1.2rem" />}
            bgColor="#EBF0F3"
            color="#2E4B6C"
            borderRadius="md"
            size="md"
            _hover={{ bgColor: "#D3DCE3" }}
            _active={{ bgColor: "#C4CFD8" }}
          />
        </Tooltip>
        <MenuList zIndex={1400}>
          {options.map((opt) => (
            <MenuItem
              key={opt.value}
              onClick={() => onChange(opt.value)}
              fontWeight={value === opt.value ? "bold" : "normal"}
              bgColor={value === opt.value ? "#EBF0F3" : "transparent"}
              _hover={{ bgColor: "#D3DCE3" }}
            >
              {t(opt.labelKey)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </FormControl>
  );
}
