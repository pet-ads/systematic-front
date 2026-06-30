import { useState } from "react";
import { Table, Tbody, Tr, Td, TableContainer } from "@chakra-ui/react";
import DeleteButton from "@components/common/buttons/DeleteButton";
import DeleteSourceModal from "@features/review/planning-protocol/components/common/modals/DeleteSourceModal";
import { tbConteiner } from "./styles.ts";

interface SelectInfosTableProps {
  selectedItems: string[];
  onDeleteItem: (index: number) => void;
}

export default function SelectInfosTable({
  selectedItems,
  onDeleteItem,
}: SelectInfosTableProps) {
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

  const handleDeleteClick = (index: number) => {
    setPendingDeleteIndex(index);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteIndex !== null) {
      onDeleteItem(pendingDeleteIndex);
      setPendingDeleteIndex(null);
    }
  };

  const handleCloseModal = () => {
    setPendingDeleteIndex(null);
  };

  return (
    <>
      <TableContainer sx={tbConteiner}>
        <Table variant="simple" size="md">
          <Tbody className="tableBody">
            {selectedItems.map((item, index) => (
              <Tr key={index}>
                <Td whiteSpace={"normal"} wordBreak={"break-word"} py={"1"}>
                  {item}
                </Td>
                <Td textAlign={"right"} py={"1"}>
                  <DeleteButton
                    index={index}
                    handleDelete={() => handleDeleteClick(index)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {pendingDeleteIndex !== null && (
        <DeleteSourceModal
          sourceName={selectedItems[pendingDeleteIndex]}
          onConfirm={handleConfirmDelete}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}