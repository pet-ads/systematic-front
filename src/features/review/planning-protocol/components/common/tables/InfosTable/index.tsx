import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useEditState } from "@features/review/planning-protocol/hooks/useEdit";
import { useState } from "react";
import { tbConteiner } from "./styles";
import { Table, Tbody, Tr, Td, TableContainer, Input, Flex, Thead } from "@chakra-ui/react";
import useCreateProtocol from "@features/review/planning-protocol/services/useCreateProtocol";
import EventButton from "@components/common/buttons/EventButton";
import useValidatorSQLInjection from "@features/shared/hooks/useValidatorSQLInjection";

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
        if(!validator({value: editedValue})){
          return false
        } 
        AddTexts[editIndex] = editedValue;
        sendAddText(AddTexts, context);
      },
    });

const [newText, setNewText] = useState("");
const validator = useValidatorSQLInjection();

const handleAddText = () => {
  if(!validator({value: newText})){
    return false
  } 
  if (newText.trim() !== "") {
    onAddText(newText);
    setNewText("");
  }
};

  return (
    <TableContainer sx={tbConteiner}>
      <Table variant="simple" size="md">
        <Thead>
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
        </Thead>
        <Tbody className="tableBody">
          {AddTexts.map((addText, index) => (
              <Tr key={index}>
                <Td whiteSpace={"normal"} wordBreak={"break-word"} py={"1"}>
                  {editIndex === index ? (
                    <Input value={editedValue} onChange={handleChange} />
                  ) : (
                    addText
                  )}
                </Td>
                <Td textAlign={"right"} py={"1"}>
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