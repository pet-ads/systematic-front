import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useEditState } from "@features/review/planning-protocol/hooks/useEdit";
import { useState } from "react";
import { tbConteiner } from "./styles";
import { Table, Tbody, Tr, Td, TableContainer, Input, Flex, Thead, Th } from "@chakra-ui/react";
import useCreateProtocol from "@features/review/planning-protocol/services/useCreateProtocol";
import EventButton from "@components/common/buttons/EventButton";
import useToaster from "@components/feedback/Toaster";
import { useTranslation } from "react-i18next";
import DeleteCriteriaModal from "@features/review/planning-protocol/components/common/modals/DeleteCriteriaModal";

const CRITERIA_CONTEXTS = ["Inclusion criteria", "Exclusion criteria"];

interface InfosTableProps {
  AddTexts: string[];
  onDeleteAddedText: (index: number) => void;
  onAddText: (newText: string) => void;
  typeField: string;
  context: string;
  placeholder: string;
  referencePrefix?: string;
  enableReferenceCode?: boolean;
  maxLength?: number;
  tableHeight?: string;
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
  maxLength,
  tableHeight,
}: InfosTableProps) {
  const { sendAddText } = useCreateProtocol();
  const toaster = useToaster();
  const { t } = useTranslation("review/planning-protocol");

  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [newText, setNewText] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [editedCode, setEditedCode] = useState("");
  const requiresReferenceCode = CRITERIA_CONTEXTS.includes(context);

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
          .map(({ code }) => code.toUpperCase())
      : [];

  const onSaveEdit = (editedValueParam: string, editIdx: number) => {
    if (!enableReferenceCode) {
      AddTexts[editIdx] = editedValueParam.trim();
      sendAddText(AddTexts, context);
      return;
    }

    const codeToSave = editedCode.trim().toUpperCase();
    const codes = getAllCodes(editIdx);
    if (requiresReferenceCode && !codeToSave) {
      toaster({
        title: t("selectionAndExtraction.input.extractionQuestions.toaster.referenceCode.title"),
        description: t("selectionAndExtraction.input.extractionQuestions.toaster.referenceCode.description"),
        status: "warning",
      });
      return false;
    }

    if (codeToSave && codes.includes(codeToSave)) {
      toaster({
        title: `${t("selectionAndExtraction.input.extractionQuestions.toaster.duplicated.title1")} '${codeToSave}' ${t("selectionAndExtraction.input.extractionQuestions.toaster.duplicated.title2")}`,
        description: t("selectionAndExtraction.input.extractionQuestions.toaster.duplicated.description"),
        status: "error",
      });
      return false;
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
      const result = onSaveEdit(editedValue, editIndex);
      if (result === false) return;
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

    if (requiresReferenceCode && !code) {
      toaster({
        title: t("selectionAndExtraction.input.extractionQuestions.toaster.referenceCode.title"),
        description: t("selectionAndExtraction.input.extractionQuestions.toaster.referenceCode.description"),
        status: "warning",
      });
      return true;
    }

    if (code && existingCodes.includes(code)) {
      toaster({
        title: `${t("selectionAndExtraction.input.extractionQuestions.toaster.duplicated.title1")} '${code}' ${t("selectionAndExtraction.input.extractionQuestions.toaster.duplicated.title2")}`,
        description: t("selectionAndExtraction.input.extractionQuestions.toaster.duplicated.description"),
        status: "error",
      });
      return true;
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
    <>
    <TableContainer
      w="100%"
      sx={{
        ...tbConteiner,
        h: tableHeight || tbConteiner.h,
        width: "100% !important",
        maxWidth: "100% !important",
      }}
    >
      <Table variant="simple" size="md" w="100%">
        <Thead>
          <Tr>
            <Th colSpan={3} padding="1rem">
              <Flex gap="4" align="center" w="100%">
                {enableReferenceCode && (
                  <Input
                    placeholder={`${referencePrefix}-01`}
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                    maxLength={maxLength}
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
                        maxLength={maxLength}
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
                    handleDelete={() => {
                      if (CRITERIA_CONTEXTS.includes(context)) {
                        setPendingDeleteIndex(index);
                      } else {
                        onDeleteAddedText(index);
                      }
                    }}
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

    {pendingDeleteIndex !== null && CRITERIA_CONTEXTS.includes(context) && (
      <DeleteCriteriaModal
        criteriaDescription={AddTexts[pendingDeleteIndex] ?? ""}
        onConfirm={() => {
          onDeleteAddedText(pendingDeleteIndex);
          setPendingDeleteIndex(null);
        }}
        onClose={() => setPendingDeleteIndex(null)}
      />
    )}
    </>
  );
}