import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useEditState } from "@features/review/planning-protocol/hooks/useEdit";
import { tbConteiner } from "./styles";
import { Table, Tbody, Tr, Td, TableContainer, Input } from "@chakra-ui/react";
import useCreateProtocol from "@features/review/planning-protocol/services/useCreateProtocol";

interface InfosTableProps {
  AddTexts: string[];
  onDeleteAddedText: (index: number) => void;
  typeField: string;
  context: string;
}

export default function InfosTable({
  AddTexts,
  onDeleteAddedText,
  typeField,
  context,
}: InfosTableProps) {
  const { sendAddText } = useCreateProtocol();
  const { editIndex, handleEdit, handleSaveEdit, editedValue, handleChange } =
    useEditState({
      AddTexts,
      onSaveEdit: (editedValue, editIndex) => {
        AddTexts[editIndex] = editedValue;
        sendAddText(AddTexts, context);
      },
    });

  return (
    <TableContainer border="2px solid" borderColor="gray.300" sx={tbConteiner} >
      <Table variant="simple" size="md">
        <Tbody className="tableBody">
          {AddTexts.map((addText, index) => (
            <Tr key={index}>
              <Td whiteSpace={"normal"} wordBreak={"break-word"}>
                {editIndex === index ? (
                  <Input value={editedValue} onChange={handleChange} />
                ) : (
                  addText
                )}
              </Td>
              <Td textAlign={"right"}>
                <DeleteButton
                  index={index}
                  handleDelete={() => onDeleteAddedText(index)}
                />
                {typeField !== "select" ? (
                  <EditButton
                    index={index}
                    editIndex={editIndex}
                    handleEdit={() => handleEdit(index)}
                    handleSaveEdit={handleSaveEdit}
                  />
                ) : null}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
