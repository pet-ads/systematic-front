// External library
import { Box, Button, Flex, Text, Select, Tooltip } from "@chakra-ui/react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

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
  const numberOfCases = String(quantityOfPages).length;
  const isPaginationEnabled = quantityOfPages > 1;

  const actionButtons: ActionButton[] = [
    {
      label: "First page",
      icon: <MdKeyboardDoubleArrowLeft size={20} />,
      action: handleBackToInitial,
    },
    {
      label: "Previous page",
      icon: <MdKeyboardArrowLeft size={20} />,
      action: handlePrevPage,
    },
    {
      label: "Next page",
      icon: <MdKeyboardArrowRight size={20} />,
      action: handleNextPage,
    },
    {
      label: "Last page",
      icon: <MdKeyboardDoubleArrowRight size={20} />,
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
    >
      <Box flex="1" minW="100px" display={{ base: "none", md: "block" }} />
      <Flex
        flex="1"
        justifyContent="center"
        alignItems="center"
        gap=".5rem"
        minW={{ base: "100%", md: "200px" }}
        w={{ base: "100%", md: "auto" }}
        order={{ base: 2, md: 1 }}
        mb={{ base: "0.5rem", md: 0 }}
      >
        <Text whiteSpace="nowrap">Rows per page</Text>
        <Select
          w="70px"
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
        flex="1"
        justifyContent={{ base: "center", md: "flex-end" }}
        alignItems="center"
        gap="1rem"
        minW={{ base: "100%", md: "250px" }}
        w={{ base: "100%", md: "auto" }}
        order={{ base: 3, md: 2 }}
      >
        <Text whiteSpace="nowrap">
          Page {String(currentPage).padStart(numberOfCases, "0")} of
          {" " + quantityOfPages}
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
                minW="40px"
                minH="40px"
                w="40px"
                h="40px"
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
