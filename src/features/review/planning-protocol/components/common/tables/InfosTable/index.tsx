import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useEditState } from "@features/review/planning-protocol/hooks/useEdit";
import { useState, useEffect } from "react";
import { tbConteiner } from "./styles";
import { Table,Tbody,Tr,Td,TableContainer,Input,Flex,Thead,Box } from "@chakra-ui/react";
import useCreateProtocol from "@features/review/planning-protocol/services/useCreateProtocol";
import EventButton from "@components/common/buttons/EventButton";
import useValidatorSQLInjection from "@features/shared/hooks/useValidatorSQLInjection";

interface InfosTableProps {
  AddTexts: string[];
  onDeleteAddedText?: (index: number) => void;
  onAddText: (newText: string) => void;
  typeField: string;
  context: string;
  placeholder: string;
  referencePrefix?: string;
  setAddTexts?: (arr: string[]) => void;
}

export default function InfosTable({
  AddTexts,
  onDeleteAddedText,
  onAddText,
  typeField,
  context,
  placeholder,
  referencePrefix = "",
  setAddTexts,
}: InfosTableProps) {
  const { sendAddText } = useCreateProtocol();
  const { editIndex, handleEdit, handleSaveEdit, editedValue, handleChange } =
    useEditState({
      AddTexts,
      onSaveEdit: (editedValue: string, editIndex: number) => {
        const newCode = (editedValue.split(":")[0] || "").trim().toUpperCase();
        if (!newCode) {
          alert("O código de referência não pode estar vazio.");
          return;
        }
        const duplicate = AddTexts.some((item, i) => {
          if (i === editIndex) return false;
          const code = (item.split(":")[0] || "").trim().toUpperCase();
          return code === newCode;
        });
        if (duplicate) {
          alert("Código de referência duplicado. Escolha outro código.");
          return;
        }

        const updated = [...AddTexts];
        updated[editIndex] = editedValue;
        sendAddText(updated, context);
        if (setAddTexts) setAddTexts(updated);
      },
    });

  const [newText, setNewText] = useState("");
  const validator = useValidatorSQLInjection();
  const [usedCodes, setUsedCodes] = useState<string[]>([]);

  useEffect(() => {
    const codes = AddTexts.map((entry) =>
      (entry.split(":")[0] || "").trim().toUpperCase()
    ).filter(Boolean);
    setUsedCodes(codes);
  }, [AddTexts]);

  const generateNextCode = () => {
    const prefix = referencePrefix ? referencePrefix.toUpperCase() : "";
    const relevant = usedCodes.filter((c) =>
      prefix ? c.startsWith(prefix + "-") : !c.includes("-")
    );

    const nums = relevant
      .map((c) => {
        const part = prefix ? c.split("-").pop() : c;
        const n = part ? parseInt(part, 10) : NaN;
        return Number.isNaN(n) ? null : n;
      })
      .filter((n): n is number => n !== null)
      .sort((a, b) => a - b);
    for (let i = 1; ; i++) {
      if (!nums.includes(i)) {
        const formatted = String(i).padStart(2, "0");
        return prefix ? `${prefix}-${formatted}` : `${formatted}`;
      }
    }
  };

  const handleAddText = () => {
    const trimmedText = newText.trim();
    if (!validator({ value: newText })) {return false}
    if (trimmedText === "") return;
    const code = generateNextCode();
    if (usedCodes.includes(code.toUpperCase())) {
      alert("Esse código de referência já está em uso!");
      return;
    }

    const entry = `${code}: ${trimmedText}`;
    onAddText(entry);
    setUsedCodes((prev: string[]) => [...prev, code.toUpperCase()]);
    setNewText("");
  };

  const handleDelete = (index: number) => {
    const updated = AddTexts.filter((_, i) => i !== index).map((entry, i) => {
      const parts = entry.split(":");
      const content = parts.slice(1).join(":").trim();
      const newNumber = i + 1;
      const newCode = referencePrefix ? `${referencePrefix.toUpperCase()}-${String(newNumber).padStart(2,"0")}`
        : `${String(newNumber).padStart(2, "0")}`;
      return `${newCode}: ${content}`;
    });

    if (setAddTexts) {
      setAddTexts(updated);
    } else if (typeof onDeleteAddedText === "function") {
      onDeleteAddedText(index);
    }
    sendAddText(updated, context);

    const newCodes = updated.map((entry) =>
      (entry.split(":")[0] || "").trim().toUpperCase()
    );
    setUsedCodes(newCodes);
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
                  onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                  flex="1"
                />
                <EventButton text="Add" event={handleAddText} w={"2%"} />
              </Flex>
            </Td>
          </Tr>
        </Thead>
        <Tbody className="tableBody">
          {AddTexts.map((addText, index) => {
            const code = (addText.split(":")[0] || "").trim();
            const content = addText.split(":").slice(1).join(":").trim();
            return (
              <Tr key={index}>
                <Td whiteSpace={"normal"} wordBreak={"break-word"} py={"1"}>
                  {editIndex === index ? (
                    <Flex align="center">
                      <Input
                        value={editedValue}
                        onChange={handleChange}
                        flex="1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit();
                          }
                        }}
                      />
                    </Flex>
                  ) : (
                    <Box>
                      <strong style={{ marginRight: 8 }}>{code}</strong>
                      <span>{content}</span>
                    </Box>
                  )}
                </Td>
                <Td textAlign={"right"} py={"1"}>
                  <DeleteButton
                    index={index}
                    handleDelete={() => handleDelete(index)}
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
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}