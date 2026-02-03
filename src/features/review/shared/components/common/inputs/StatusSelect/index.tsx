import { FormControl, Menu, MenuButton, MenuList, MenuItem, Button, HStack, Text, Box, Divider, Portal } from "@chakra-ui/react";
import { CheckCircleIcon, ChevronDownIcon, QuestionIcon, WarningIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState, ReactNode } from "react";
import { FaRegCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import type ArticleInterface from "@features/review/shared/types/ArticleInterface";

type StatusKey = "INCLUDED" | "DUPLICATED" | "EXCLUDED" | "UNCLASSIFIED";

interface StatusSelectProps {
  articles?: ArticleInterface[]; 
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  page: "Selection" | "Extraction";
  placeholder?: string;
  totalCount?: number; 
}

const colors = {
  background: "#EBF0F3",
  text: "#2E4B6C",
  hover: "rgb(144, 205, 244)",
  selected: "rgb(190, 227, 248)",
  clearFilters: "rgb(38, 60, 86)",
};

const iconConfig: Record<Lowercase<StatusKey>, { icon: ReactNode; bg: string }> = {
  included: { icon: <CheckCircleIcon color="green.500" />, bg: "green.100" },
  duplicated: { icon: <WarningIcon color="blue.500" />, bg: "blue.100" },
  excluded: { icon: <IoIosCloseCircle color="red" size="1.4rem" />, bg: "red.100" },
  unclassified: { icon: <QuestionIcon color="yellow.500" />, bg: "yellow.100" },
};

const getIcon = (status: string) => {
  const cfg = iconConfig[status.toLowerCase() as Lowercase<StatusKey>];
  if (!cfg) return <FaRegCircle color="gray" />;
  return (
    <Box display="flex" alignItems="center" justifyContent="center" w="20px" h="20px" borderRadius="50%" bg={cfg.bg}>
      {cfg.icon}
    </Box>
  );
};

export default function StatusSelect({
  articles = [],
  selectedValue,
  onSelect,
  page,
  placeholder = "Select status",
  totalCount,
}: StatusSelectProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [menuWidth, setMenuWidth] = useState<number>(0);

  const isClientSide = articles.length > 0;

  const counts: Record<StatusKey, number> = {
    INCLUDED: 0, DUPLICATED: 0, EXCLUDED: 0, UNCLASSIFIED: 0,
  };

  if (isClientSide) {
    articles.forEach((a) => {
      const status = page === "Selection" ? a.selectionStatus : a.extractionStatus;
      if (status && counts[status as StatusKey] !== undefined) {
        counts[status as StatusKey] += 1;
      }
    });
  }

  const options = [
    { value: "INCLUDED", label: "Included" },
    { value: "DUPLICATED", label: "Duplicated" },
    { value: "EXCLUDED", label: "Excluded" },
    { value: "UNCLASSIFIED", label: "Unclassified" },
  ];

  const getLabel = (optionLabel: string, optionValue: string) => {
    if (isClientSide) {
      return `${optionLabel} (${counts[optionValue as StatusKey]})`;
    }
    if (selectedValue === optionValue && totalCount !== undefined) {
      return `${optionLabel} (${totalCount})`;
    }
    return optionLabel;
  };

  const selectedOption = options.find((o) => o.value === selectedValue);
  let buttonLabel = placeholder;
  if (selectedOption) {
    buttonLabel = getLabel(selectedOption.label, selectedOption.value);
  }

  useEffect(() => {
    const update = () => setMenuWidth(btnRef.current?.offsetWidth ?? 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [buttonLabel]);

  return (
    <FormControl w="20rem">
      <Menu isLazy>
        <MenuButton
          ref={btnRef}
          as={Button}
          bgColor={colors.background}
          color={colors.text}
          rightIcon={<ChevronDownIcon />}
          w="100%"
          textAlign="left"
          fontWeight="normal"
        >
          {buttonLabel}
        </MenuButton>
        <Portal>
          <MenuList
            minW="unset"
            w={menuWidth ? `${menuWidth}px` : "100%"}
            maxW={menuWidth ? `${menuWidth}px` : "100%"}
            zIndex={1400}
            p={0}
            boxShadow="none"
            overflow="hidden"
          >
            {options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              const displayLabel = getLabel(opt.label, opt.value);
              
              return (
                <MenuItem
                  key={opt.value}
                  onClick={() => onSelect(opt.value)}
                  w="100%"
                  bg={isSelected ? colors.selected : "transparent"}
                  _hover={{ bg: colors.hover }}
                >
                  <HStack w="100%" spacing={3}>
                    {getIcon(opt.value)}
                    <Text flex="1" textAlign="left" color={colors.text}>
                      {displayLabel}
                    </Text>
                  </HStack>
                </MenuItem>
              );
            })}
            <Divider borderColor="gray.300" />
            <MenuItem onClick={() => onSelect(null)} w="100%">
              <Text flex={1} textAlign="center" fontWeight="semibold" color={colors.clearFilters}>
                Clear filters
              </Text>
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </FormControl>
  );
}