import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useEditState } from "@features/review/planning-protocol/hooks/useEdit";
import { useState } from "react";
import { tbConteiner } from "./styles";
import { Table, Tbody, Tr, Td, TableContainer, Input, Tfoot, Flex } from "@chakra-ui/react";
import useCreateProtocol from "@features/review/planning-protocol/services/useCreateProtocol";
import EventButton from "@components/common/buttons/EventButton";

interface InfosTableProps {
  AddTexts: string[];
  onDeleteAddedText: (index: number) => void;
  onAddText: (newText : string) => void;
  typeField: string;
  context: string;
  placeholder: string;
}

export default function InfosTable({
  AddTexts,
  onDeleteAddedText,
  onAddText,
  typeField,
  context,
  placeholder,
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

const [newText, setNewText] = useState("");

const handleAddText = () => {
  if (newText.trim() !== "") {
    onAddText(newText);
    setNewText("");
  }
};

  return (
    <TableContainer sx={tbConteiner}>
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
        <Tfoot>
          <Tr>
            <Td colSpan={2} padding="1rem">
              <Flex gap="4">
                <Input
                  placeholder={placeholder}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                />
                <EventButton text="Add" event={handleAddText} w={"2%"} />
              </Flex>
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
}
