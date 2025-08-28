import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useEditState } from "@features/review/planning-protocol/hooks/useEdit";
import { useState } from "react";
import { tbConteiner } from "./styles";
import { Table, Tbody, Tr, Td, TableContainer, Input, Button } from "@chakra-ui/react";
import useCreateProtocol from "@features/review/planning-protocol/services/useCreateProtocol";
import useToaster from "@components/feedback/Toaster";
import { capitalize } from "@features/shared/utils/helpers/formatters/CapitalizeText";

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
        const updatedAddTexts = [...AddTexts]; 
        updatedAddTexts[editIndex] = editedValue; 
        
        sendAddText(updatedAddTexts, context);
      },
    });

    const [newText, setNewText] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewText(e.target.value);
    };

    const toast = useToaster();

    const handleAddNewText = () => {
    const normalizedAddTextValue = capitalize(newText.toLowerCase().trim());
    if (normalizedAddTextValue !== "") {
      const updatedAddTexts = [...AddTexts, normalizedAddTextValue];
      sendAddText(updatedAddTexts, context);
      setNewText(""); 
    } else {
      toast({
        title: "Empty Field",
        description: "The field must be filled!",
        status: "warning",
      });
    }
  };

  return (
    <TableContainer sx={tbConteiner}>
      <Table variant="simple" size="md">
        <Tbody className="tableBody">
          {AddTexts.map((addText, index) => (
            <Tr key={index}>
              <Td>
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
          <Tr>
            <Td>
              <Input
                value={newText}
                placeholder="Add new item..."
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddNewText();
                  }
                }}
                />
            </Td>
            <Td textAlign={"right"}>
              <Button onClick={handleAddNewText} ml={2}>
                ADD
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
