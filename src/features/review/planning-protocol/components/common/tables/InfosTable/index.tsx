import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useEditState } from "@features/review/planning-protocol/hooks/useEdit";
import { useState } from "react";
import { tbConteiner } from "./styles";
import { Table, Tbody, Tr, Td, TableContainer, Input, Flex, Thead } from "@chakra-ui/react";
import useCreateProtocol from "@features/review/planning-protocol/services/useCreateProtocol";
import EventButton from "@components/common/buttons/EventButton";

interface InfosTableProps {
  AddTexts: string[];
  onDeleteAddedText: (index: number) => void;
  onAddText: (newText : string) => void;
  typeField: string;
  context: string;
  placeholder: string;
  referencePrefix?: string;
}

export default function InfosTable({
  AddTexts,
  onDeleteAddedText,
  onAddText,
  typeField,
  context,
  placeholder,
  referencePrefix = "",
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
  const [referenceCode, setReferenceCode] = useState("");
  const [usedCodes, setUsedCodes] = useState<string[]>([]);

  const generateNextCode = () => {
    const nextNumber = usedCodes.length + 1;
    return `${referencePrefix}-${String(nextNumber).padStart(2, "0")}`;
  };

  const handleAddText = () => {
    const trimmedText = newText.trim();
    if (trimmedText === "") return;

    const code = referenceCode || generateNextCode();

    if (usedCodes.includes(code)) {
      alert("Esse código de referência já está em uso!");
      return;
    }

    const entry = `${code}: ${trimmedText}`;
    onAddText(entry);
    setUsedCodes((prev) => [...prev, code]);
    setNewText("");
    setReferenceCode("");
  };

  return (
    <TableContainer sx={tbConteiner}>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Td colSpan={2} padding="1rem">
              <Flex gap="4">
                <Input
                  placeholder={`${referencePrefix}-01`}
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value.toUpperCase().trim())}
                  w="15%"
                />
                <Input
                  placeholder={placeholder}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                  flex="1"
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
                {typeField !== "select" && (
                  <EditButton
                    index={index}
                    editIndex={editIndex}
                    handleEdit={() => handleEdit(index)}
                    handleSaveEdit={handleSaveEdit}
                  />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}