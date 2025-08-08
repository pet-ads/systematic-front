import {
  Button,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface ControlsProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  quantityOfPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  changeQuantityOfItens: (newQuantity: number) => void;
}

export default function PaginationControl({
  currentPage,
  setCurrentPage,
  quantityOfPages,
  handleNextPage,
  handlePrevPage,
  changeQuantityOfItens,
}: ControlsProps) {
  const numberOfCases = String(quantityOfPages).length;

  const isPaginationEnabled = quantityOfPages > 1;

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      gap="1rem"
      w="100%"
      bg="white"
      p="1.5rem 0"
      borderRadius="0 0 1rem 1rem"
    >
      {isPaginationEnabled && (
        <Button onClick={handlePrevPage}>Anterior</Button>
      )}
      <Text>
        Página {String(currentPage).padStart(numberOfCases, "0")} de
        {" " + quantityOfPages}
      </Text>
      <NumberInput
        width="5rem"
        min={1}
        max={quantityOfPages}
        value={currentPage}
        onChange={(valueString) => {
          const pageNumber = Number(valueString);
          if (pageNumber >= 1 && pageNumber <= quantityOfPages) {
            setCurrentPage(pageNumber);
          }
        }}
      >
        <NumberInputField border="2px solid black" />
        <NumberInputStepper>
          <NumberIncrementStepper color="black" />
          <NumberDecrementStepper color="black" />
        </NumberInputStepper>
      </NumberInput>
      {isPaginationEnabled && <Button onClick={handleNextPage}>Próxima</Button>}
      <Flex alignItems="center" gap=".5rem">
        <Text>Rows per page</Text>
        <select onChange={(e) => changeQuantityOfItens(Number(e.target.value))} defaultValue={15}>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
        <option value={25}>25</option>
        <option value={30}>30</option>
      </select>
      </Flex>
    </Flex>
  );
}