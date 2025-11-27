import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useEditState } from "@features/review/planning-protocol/hooks/useEdit";
import { useState } from "react";
import { tbConteiner } from "./styles";
import { Table, Tbody, Tr, Td, TableContainer, Input, Flex, Thead, Th } from "@chakra-ui/react";
import useCreateProtocol from "@features/review/planning-protocol/services/useCreateProtocol";
import EventButton from "@components/common/buttons/EventButton";

interface InfosTableProps {
  AddTexts: string[];
  onDeleteAddedText: (index: number) => void;
  onAddText: (newText: string) => void;
  typeField: string;
  context: string;
  placeholder: string;
  referencePrefix?: string;
  enableReferenceCode?: boolean;
}

export default function InfosTable({
  AddTexts,
  onDeleteAddedText,
  onAddText,
  typeField,
  context,
  placeholder,
  referencePrefix = "",
  enableReferenceCode = true,
}: InfosTableProps) {
  const { sendAddText } = useCreateProtocol();

  const [newText, setNewText] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [editedCode, setEditedCode] = useState("");

  const parseEntry = (entry: string) => {
    if (!enableReferenceCode) return { code: "", text: entry };
    const idx = entry.indexOf(":");
    if (idx === -1) return { code: "", text: entry };
    const code = entry.slice(0, idx).trim();
    const text = entry.slice(idx + 1).trim();
    return { code, text };
  };

  const getAllCodes = (excludeIndex?: number) =>
    enableReferenceCode
      ? AddTexts.map((entry, i) => ({ code: parseEntry(entry).code, i }))
          .filter(({ code, i }) => code && i !== excludeIndex)
          .map(({ code }) => code)
      : [];

  const onSaveEdit = (editedValueParam: string, editIdx: number) => {
    if (!enableReferenceCode) {
      AddTexts[editIdx] = editedValueParam.trim();
      sendAddText(AddTexts, context);
      return;
    }

    const codeToSave = editedCode.trim().toUpperCase();
    const codes = getAllCodes(editIdx);
    if (codeToSave && codes.includes(codeToSave)) {
      alert("Esse código de referência já está em uso!");
      return;
    }

    const parsed = parseEntry(editedValueParam);
    const editedTextOnly = parsed.text ?? editedValueParam.trim();

    const newEntry = codeToSave
      ? `${codeToSave}: ${editedTextOnly.trim()}`
      : editedTextOnly.trim();

    AddTexts[editIdx] = newEntry;
    sendAddText(AddTexts, context);
  };

  const { editIndex, handleEdit, handleSaveEdit, editedValue, handleChange } =
    useEditState({
      AddTexts,
      onSaveEdit,
    });

  const handleSaveEditWrapper = () => {
    if (editIndex !== null && editIndex !== undefined) {
      onSaveEdit(editedValue, editIndex);
    }
    handleSaveEdit();
  };

  const handleAddText = () => {
    const trimmedText = newText.trim();
    if (trimmedText === "") return;

    if (!enableReferenceCode) {
      onAddText(trimmedText);
      setNewText("");
      return;
    }

    const code = referenceCode.trim().toUpperCase();
    const existingCodes = getAllCodes();

    if (code && existingCodes.includes(code)) {
      alert("Esse código de referência já está em uso!");
      return;
    }

    const entry = code ? `${code}: ${trimmedText}` : trimmedText;
    onAddText(entry);
    setNewText("");
    setReferenceCode("");
  };

  const handleEditWrapper = (index: number) => {
    const { code, text } = parseEntry(AddTexts[index] || "");
    setEditedCode(code);
    handleEdit(index);

    setTimeout(() => {
      handleChange({ target: { value: text } } as any);
    }, 0);
  };

  return (
    <TableContainer sx={tbConteiner}>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th colSpan={3} padding="1rem">
              <Flex gap="4" align="center">
                {enableReferenceCode && (
                  <Input
                    placeholder={`${referencePrefix}-01`}
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value)}
                    onBlur={() =>
                      setReferenceCode((s) => s.trim().toUpperCase())
                    }
                    w="100px"
                    size="md"
                    sx={{ textTransform: "uppercase" }}
                  />
                )}
                <Input
                  placeholder={placeholder}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                  flex="1"
                  size="md"
                />
                <EventButton text="Add" event={handleAddText} w={"40px"} />
              </Flex>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {AddTexts.map((addText, index) => {
            const { code, text } = parseEntry(addText);
            return (
              <Tr key={index}>
                {enableReferenceCode && (
                  <Td
                    whiteSpace={"nowrap"}
                    overflow="hidden"
                    textOverflow={"ellipsis"}
                    wordBreak={"normal"}
                    py={"1"}
                    w="120px"
                  >
                    {editIndex === index ? (
                      <Input
                        value={editedCode}
                        onChange={(e) => setEditedCode(e.target.value)}
                        onBlur={() =>
                          setEditedCode((c) => c.trim().toUpperCase())
                        }
                        size="md"
                        pl={0.5}
                        pr={0.5}
                        sx={{ textTransform: "uppercase" }}
                      />
                    ) : (
                      code || "-"
                    )}
                  </Td>
                )}
                <Td whiteSpace={"normal"} wordBreak={"break-word"} py={"1"}>
                  {editIndex === index ? (
                    <Input
                      value={editedValue}
                      onChange={handleChange}
                      size="md"
                    />
                  ) : (
                    text
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
                      handleEdit={() => handleEditWrapper(index)}
                      handleSaveEdit={handleSaveEditWrapper}
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