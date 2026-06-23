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
      p="1.5rem"
      borderRadius="0 0 1rem 1rem"
      flexWrap="wrap"
      alignItems="center"
      position="relative"
    >
      <Flex
        flex="1"
        justifyContent={window > 1000 ? "center" : "flex-start"}
        alignItems="center"
        gap=".5rem"
        minW={{ base: "100%", md: "200px" }}
        w={{ base: "100%", md: "auto" }}
        order={{ base: 2, md: 1 }}
        mb={{ base: "0.5rem", md: 0 }}
      >
        <Text whiteSpace="nowrap"  fontSize={window > 1000 ? "1rem" : "0.8rem"}>{t("pagination.rowsPerPage")}</Text>
        <Select
          w="70px"
          fontSize={window > 1000 ? "1rem" : "0.8rem"}
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
        right="2rem"
        alignItems="center"
        gap="0.2rem"
      >
        <Text whiteSpace="nowrap" fontSize={window > 1000 ? "1rem" : "0.8rem"}>
          {t("pagination.page") +
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
            >
              <Button
                key={index}
                variant="outline"
                onClick={action}
                aria-label={label}
                minW={window > 1000 ? "40px" : "30px"}
                minH={window > 1000 ? "40px" : "30px"}
                w={window > 1000 ? "40px" : "30px"}
                h={window > 1000 ? "40px" : "30px"}
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
  );
};

export default PaginationControl;
