import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import { useEditState } from "../../hooks/useEdit";
import { tbConteiner } from "./styles/infosTableStyles";
import { Table, Tbody, Tr, Td, TableContainer, Input } from "@chakra-ui/react";
import useCreateProtocol from "../../hooks/reviews/useCreateProtocol";

interface InfosTableProps {
  AddTexts: string[];
  onDeleteAddedText: (index: number) => void;
  typeField: string;
  context: string
}

export default function InfosTable({ AddTexts, onDeleteAddedText, typeField, context }: InfosTableProps) {
  const { sendAddText } = useCreateProtocol();
  const { editIndex, handleEdit, handleSaveEdit, editedValue, handleChange } = useEditState({
    AddTexts,
    onSaveEdit: (editedValue, editIndex) => {
      AddTexts[editIndex] = editedValue;
      sendAddText(AddTexts, context);
    },
  });

  return (
    <TableContainer sx={tbConteiner}>
      <Table variant="simple" size="md">
        <Tbody className="tableBody">
          {AddTexts.map((addText, index) => (
            <Tr key={index}>
              <Td>{editIndex === index ? <Input value={editedValue} onChange={handleChange} /> : addText}</Td>
              <Td textAlign={"right"}>
                <DeleteButton index={index} handleDelete={() => onDeleteAddedText(index)} />
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