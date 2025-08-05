import {
  Flex,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Dispatch, SetStateAction } from "react";

interface ControlsProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  quantityOfPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

export default function PaginationControl({
  currentPage,
  setCurrentPage,
  quantityOfPages,
  handleNextPage,
  handlePrevPage,
}: ControlsProps) {
  const numberOfCases = String(quantityOfPages).length;

  const isPaginationEnabled = quantityOfPages > 1;

  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      gap="0.75rem"
      w="100%"
      p="1rem"
      bg="white"
      borderRadius="md"
      flexWrap="wrap"
    >
      {isPaginationEnabled && (
        <IconButton
          aria-label="Página anterior"
          icon={<ChevronLeftIcon />}
          onClick={handlePrevPage}
          isDisabled={currentPage === 1}
          size="sm"
          variant="ghost"
          _hover={{ bg: "gray.100" }}
          _active={{ bg: "gray.200" }}
        />
      )}

      <Text fontWeight="medium" fontSize="sm">
        Página {String(currentPage).padStart(numberOfCases, "0")} de {quantityOfPages}
      </Text>

      <NumberInput
        width="4rem"
        min={1}
        max={quantityOfPages}
        value={currentPage}
        onChange={(valueString) => {
          const pageNumber = Number(valueString);
          if (pageNumber >= 1 && pageNumber <= quantityOfPages) {
            setCurrentPage(pageNumber);
          }
        }}
        size="sm"
      >
        <NumberInputField
          border={`1px solid ${borderColor}`}
          borderRadius="md"
          textAlign="center"
          _hover={{ borderColor: "gray.400" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      {isPaginationEnabled && (
        <IconButton
          aria-label="Próxima página"
          icon={<ChevronRightIcon />}
          onClick={handleNextPage}
          isDisabled={currentPage === quantityOfPages}
          size="sm"
          variant="ghost"
          _hover={{ bg: "gray.100" }}
          _active={{ bg: "gray.200" }}
        />
      )}
    </Flex>
  );
}
