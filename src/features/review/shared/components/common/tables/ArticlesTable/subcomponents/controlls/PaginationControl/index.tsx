// External library
import { Button, Flex, Text, Select, Tooltip } from "@chakra-ui/react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useTranslation } from "react-i18next";

// Hooks
import useWindowWidth from "@features/shared/hooks/useWindowWidth";

// Types
interface PaginationControlProps {
  currentPage: number;
  itensPerPage: number;
  quantityOfPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleBackToInitial: () => void;
  handleGoToFinal: () => void;
  changeQuantityOfItens: (newQuantity: number) => void;
  isSplited?: boolean;
  isVertical?: boolean;
  rightElement?: React.ReactNode;
}

type ActionButton = {
  icon: React.ReactElement;
  action: () => void;
  label: string;
};

const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  itensPerPage,
  quantityOfPages,
  handleNextPage,
  handlePrevPage,
  handleBackToInitial,
  handleGoToFinal,
  changeQuantityOfItens,
  isSplited,
  isVertical,
  rightElement,
}) => {
  const window = useWindowWidth();
  const numberOfCases = String(quantityOfPages).length;
  const isPaginationEnabled = quantityOfPages > 1;

  const { t } = useTranslation("review/execution-selection");

  const actionButtons: ActionButton[] = [
    {
      label: t("pagination.firstPage"),
      icon: <MdKeyboardDoubleArrowLeft size={window > 1000 ? 20 : 15} />,
      action: handleBackToInitial,
    },
    {
      label: t("pagination.previousPage"),
      icon: <MdKeyboardArrowLeft size={window > 1000 ? 20 : 15} />,
      action: handlePrevPage,
    },
    {
      label: t("pagination.nextPage"),
      icon: <MdKeyboardArrowRight size={window > 1000 ? 20 : 15} />,
      action: handleNextPage,
    },
    {
      label: t("pagination.lastPage"),
      icon: <MdKeyboardDoubleArrowRight size={window > 1000 ? 20 : 15} />,
      action: handleGoToFinal,
    },
  ];

  const paginationValues = [10, 15, 20, 25, 30];

  return (
    <Flex
      w="100%"
      bg="white"
      pt="0.75rem"
      pb={rightElement ? "3rem" : "0.75rem"}
      px="1.5rem"
      borderRadius="0 0 1rem 1rem"
      position="relative"
      direction="column"
    >
      <Flex
        w="100%"
        alignItems="center"
        position="relative"
        minH="36px"
      >
        <Flex
          flex="1"
          justifyContent={window > 1200 && (window > 1700 || !isSplited) ? "center" : "flex-start"}
          alignItems="center"
          gap=".5rem"
          minW={{ base: "100%", md: "200px" }}
          w={{ base: "100%", md: "auto" }}
        >
          <Text whiteSpace="nowrap" fontSize={window > 1000 ? "1rem" : "0.8rem"}>
            {window < 1000 || window > 1400 || !isVertical ? t("pagination.rowsPerPage") : ""}
          </Text>
          <Select
            w={window > 1000 && window < 1050 ? "65px" : "70px"}
            fontSize={window < 1000 || window > 1050 ? "1rem" : "0.8rem"}
            h="32px"
            textAlign="center"
            onChange={(e) => changeQuantityOfItens(Number(e.target.value))}
            value={itensPerPage}
            defaultValue={20}
          >
            {paginationValues.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex
          position="absolute"
          right="0"
          alignItems="center"
          gap="0.5rem"
        >
          <Text whiteSpace="nowrap" fontSize={window > 1050 ? "1rem" : "0.8rem"}>
            {(window < 1000 || window > 1150 ? t("pagination.page") : "") +
              " " +
              String(currentPage).padStart(numberOfCases, "0") +
              " " +
              t("pagination.of") +
              " " +
              quantityOfPages}
          </Text>
          {isPaginationEnabled &&
            actionButtons.map(({ icon, action, label }, index) => (
              <Tooltip
                label={label}
                hasArrow
                placement="top"
                p=".5rem"
                borderRadius=".25rem"
                key={index}
              >
                <Button
                  variant="outline"
                  onClick={action}
                  aria-label={label}
                  minW={window > 1000 ? "36px" : "28px"}
                  minH={window > 1000 ? "36px" : "28px"}
                  w={window > 1000 ? "36px" : "28px"}
                  h={window > 1000 ? "36px" : "28px"}
                  p="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {icon}
                </Button>
              </Tooltip>
            ))}
        </Flex>
      </Flex>

      {rightElement && (
        <Flex
          position="absolute"
          bottom="0.6rem"
          right="1.5rem"
          justifyContent="flex-end"
          alignItems="center"
        >
          {rightElement}
        </Flex>
      )}
    </Flex>
  );
};

export default PaginationControl;
