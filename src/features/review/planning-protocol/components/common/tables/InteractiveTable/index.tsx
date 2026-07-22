// External library
import { useEffect, useState } from "react";
import { Input, Select, FormLabel, Textarea, Text } from "@chakra-ui/react";
import { mutate } from "swr";
import { useTranslation } from "react-i18next";
import Axios from "../../../../../../../infrastructure/http/axiosClient";
import EventButton from "@components/common/buttons/EventButton";

import DefaultTable from "@components/common/tables/DefaultTable";
import { Column, SortConfig } from "@components/common/tables/DefaultTable/types";

import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import TextareaAutosize from "react-textarea-autosize";
import { useInteractiveTable, Row } from "../../../../hooks/useInteractiveTable";
import useSendExtractionForm from "../../../../../execution-extraction/services/useSendExtractionForm";
import NumberScaleModal from "../../modals/NumberScaleModal";
import PickListModal from "../../modals/PickListModal";
import PickManyModal from "../../modals/PickManyModal";
import LabeledScaleModal from "../../modals/LabeledScaleModal";
import useValidatorSQLInjection from "@features/shared/hooks/useValidatorSQLInjection";
import useToaster from "@components/feedback/Toaster";

interface Props {
  id: string;
  url: string;
  label: string;
}

export default function InteractiveTable({ id, url, label }: Props) {
  let adress = "";
  if (label == "Extraction Questions" || label == "Questões de Extração") adress = "extraction-question";
  if (label == "Risk of Bias Questions" || label == "Questões sobre Risco de Viés") adress = "rob-question";

  const protocolKey = `systematic-study/${id}/protocol/${adress}`;

  const toaster = useToaster();
  const validator = useValidatorSQLInjection();
  const { t } = useTranslation("review/planning-protocol");

  const {
    setRows,
    rows,
    addRow,
    handleDelete,
    handleQuestionChange,
    handleTypeChange,
    options,
    handleServerSend,
    handleAddQuestions,
    handleNumberScale,
    handleLabeledList,
    handlePickMany,
  } = useInteractiveTable();

  const {
    sendTextualQuestion,
    sendPickListQuestion,
    sendNumberScaleQuestion,
    sendLabeledListQuestion,
    sendPickManyQuestion,
    updateTextualQuestion,
    updatePickListQuestion,
    updateNumberScaleQuestion,
    updateLabeledListQuestion,
    updatePickManyQuestion,
    deleteQuestion,
  } = useSendExtractionForm(adress);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [pendingNewIndex, setPendingNewIndex] = useState<number | null>(null);
  const [numberScale, setnumberScale] = useState<number[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [pickManyQuestions, setPickManyQuestions] = useState<string[]>([]);
  const [labeledQuestions, setLabeledQuestions] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<Row>>(null);

  function normalizeCode(code: string) {
    return code.trim().toUpperCase();
  }

  useEffect(() => {
    setQuestions([]);
    const fetch = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        let options = { headers: { Authorization: `Bearer ${accessToken}` } };

        let response = await Axios.get(url, options);
        let link = `systematic-study/${id}/protocol/${adress}`;
        response = await Axios.get(link, options);

        const fetchedRows = response.data.questions.map(
          (item: {
            questionType: any;
            code: any;
            description: any;
            questionId: string;
            options: string[];
            lower: number;
            higher: number;
            scales: Record<string, number>;
          }) => {
            let type;
            let questions;
            switch (item.questionType) {
              case "TEXTUAL":
                type = t("selectionAndExtraction.input.extractionQuestions.questionType.textual");
                break;
              case "PICK_LIST":
                type = t("selectionAndExtraction.input.extractionQuestions.questionType.pickList");
                questions = item.options;
                break;
              case "NUMBERED_SCALE":
                type = t("selectionAndExtraction.input.extractionQuestions.questionType.numberedScale");
                break;
              case "LABELED_SCALE":
                type = t("selectionAndExtraction.input.extractionQuestions.questionType.labeledList");
                break;
              case "PICK_MANY":
                type = t("selectionAndExtraction.input.extractionQuestions.questionType.pickMany");
                questions = item.options;
                break;
            }
            return {
              id: String(item.code),
              question: item.description,
              type: type,
              questionId: item.questionId,
              isNew: false,
              questions: questions,
              higher: item.higher,
              lower: item.lower,
              scale: item.scales,
            };
          },
        );
        setRows(fetchedRows);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };
    fetch();
  }, [id, url, adress, setRows]);

  function handleSelect(index: number, newValue: string) {
    if (!newValue || newValue.trim() === "") return;

    handleTypeChange(index, newValue);
    setModalType(newValue);
    setShowModal(true);
  }

  async function revalidateFormulary() {
    await mutate(protocolKey);

    await mutate(
      (key: string) =>
        typeof key === "string" &&
        key.includes(`systematic-study/${id}/report/`) &&
        key.includes("/included-studies-answers"),
    );
  }

  async function handleSaveEdit(index: number, closeEditMode: boolean = true) {
    if (!validator({ value: rows[index].question })) return;

    if (String(rows[index].id).trim() === "") {
      toaster({
        title: t("selectionAndExtraction.input.extractionQuestions.toaster.referenceCode.title"),
        description: t("selectionAndExtraction.input.extractionQuestions.toaster.referenceCode.description"),
        status: "warning",
      });
      return;
    }

    const currentCode = String(rows[index].id).trim().toUpperCase();
    const isDuplicate = rows.some(
      (row, i) => i !== index && String(row.id).trim().toUpperCase() === currentCode,
    );

    if (currentCode !== "" && isDuplicate) {
      toaster({
        title: t("selectionAndExtraction.input.extractionQuestions.toaster.duplicated.title1") + ` ${currentCode} ` + t("selectionAndExtraction.input.extractionQuestions.toaster.duplicated.title2"),
        description: t("selectionAndExtraction.input.extractionQuestions.toaster.duplicated.description"),
        status: "error",
      });
      return;
    }

    const row = rows[index];
    if (!row.type || row.type.trim() === "") {
      toaster({
        title: t(
          "selectionAndExtraction.input.extractionQuestions.toaster.questionType.title",
        ),
        description: t(
          "selectionAndExtraction.input.extractionQuestions.toaster.questionType.description",
        ),
        status: "warning",
      });
      return;
    }
    
    const { question, id: code, type, isNew, questionId: serverId } = row;
    const questionId = code;
    const reviewId = id;

    let data: any;
    let questionType: string | null = null;
    let newQuestionId: string | null = null;

    try {
      if (type === t("selectionAndExtraction.input.extractionQuestions.questionType.textual")) {
        questionType = "TEXTUAL";
        data = { question, questionId, reviewId };
        if (isNew) newQuestionId = await sendTextualQuestion(data);
        else await updateTextualQuestion(data, serverId, questionType);
      } else if (type === t("selectionAndExtraction.input.extractionQuestions.questionType.pickList")) {
        questionType = "PICK_LIST";
        data = { question, questionId, reviewId, options: questions };
        handleAddQuestions(index, questions);
        if (isNew) newQuestionId = await sendPickListQuestion(data);
        else await updatePickListQuestion(data, serverId, questionType);
      } else if (type === t("selectionAndExtraction.input.extractionQuestions.questionType.numberedScale")) {
        questionType = "NUMBERED_SCALE";
        data = { question, questionId, reviewId, lower: numberScale[0], higher: numberScale[1] };
        handleNumberScale(index, numberScale[0], numberScale[1]);
        if (isNew) newQuestionId = await sendNumberScaleQuestion(data);
        else await updateNumberScaleQuestion(data, serverId);
      } else if (type === t("selectionAndExtraction.input.extractionQuestions.questionType.labeledList")) {
        questionType = "LABELED_SCALE";
        data = { question, questionId, reviewId, scales: labeledQuestions };
        handleLabeledList(index, labeledQuestions);
        if (isNew) newQuestionId = await sendLabeledListQuestion(data);
        else await updateLabeledListQuestion(data, serverId);
      } else if (type === t("selectionAndExtraction.input.extractionQuestions.questionType.pickMany")) {
        questionType = "PICK_MANY";
        data = { question, questionId, reviewId, options: pickManyQuestions };
        handlePickMany(index, pickManyQuestions);
        if (isNew) newQuestionId = await sendPickManyQuestion(data);
        else await updatePickManyQuestion(data, serverId, questionType);
      }

      if (isNew && newQuestionId) {
        handleServerSend(index, newQuestionId);
      }

      await revalidateFormulary();

      if (closeEditMode) {
        setEditIndex(null);
        if (pendingNewIndex === index) {
          setPendingNewIndex(null);
        }
      }
    } catch (error) {
      console.error("Failed to save question:", error);
    }
  }

  async function handleSaveDelete(index: number) {
    if (!validator({ value: rows[index].question })) return;

    const row = rows[index];
    const { questionId: serverId } = row;
    const reviewId = id;

    try {
      const data = {
        reviewId,
        question: row.question,
        questionId: String(row.id),
        options: row.questions || [],
      };

      await deleteQuestion(data as any, serverId);
      handleDelete(index);

      await revalidateFormulary();

      if (pendingNewIndex === index) {
        setPendingNewIndex(null);
        setEditIndex(null);
      }
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  }

  const handleIdChange = (index: number, newId: string) => {
    const limitedId = normalizeCode(newId).slice(0, 7);
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, id: limitedId } : row)),
    );
  };

  function discardPendingNewRow() {
    if (pendingNewIndex !== null) {
      setRows((prev) => prev.filter((_, i) => i !== pendingNewIndex));
      setPendingNewIndex(null);
      setEditIndex(null);
    }
  }

  function addNewRow() {
    if (editIndex !== null) {
      toaster({
        title: t("selectionAndExtraction.input.extractionQuestions.toaster.finishEditing"),
        status: "warning",
      });
      return;
    }

    addRow(setEditIndex, setQuestions);
    setPickManyQuestions([]);

    setRows((prevRows) => {
      const newRows = [...prevRows];
      const lastIndex = newRows.length - 1;
      if (newRows[lastIndex]) {
        newRows[lastIndex] = { ...newRows[lastIndex], id: "" };
      }
      setPendingNewIndex(lastIndex);
      return newRows;
    });
  }

  const columns: Column<Row>[] = [
    {
      key: "id",
      label: "ID",
      width: "10%",
      render: (row, index) => {
        const isEditing = editIndex === index;

        if (!isEditing) {
          return (
            <Text
              fontSize="sm"
              color="black"
              textAlign="center"
              fontWeight="semibold"
              sx={{ textTransform: "uppercase" }}
            >
              {row.id || "—"}
            </Text>
          );
        }

        return (
          <Input
            value={row.id}
            onChange={(e) => handleIdChange(index, e.target.value)}
            maxLength={7}
            border="solid 1px #303D50"
            bg="white"
            cursor="text"
            _focus={{ boxShadow: "outline" }}
            borderRadius="md"
            size="sm"
            sx={{ textTransform: "uppercase" }}
          />
        );
      },
    },

    {
      key: "question",
      label: t("selectionAndExtraction.input.extractionQuestions.question"),
      width: "40%",
      render: (row, index) => {
        const isEditing = editIndex === index;
        return (
          <Textarea
            as={TextareaAutosize}
            minRows={1}
            minH="unset"
            value={row.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            isReadOnly={!isEditing}
            border={isEditing ? "solid 1px #303D50" : "transparent"}
            bg={isEditing ? "white" : "transparent"}
            cursor={isEditing ? "text" : "default"}
            _focus={{ boxShadow: isEditing ? "outline" : "none" }}
            resize="none"
            overflow="hidden"
            whiteSpace="pre-wrap"
            w="100%"
            borderRadius="md"
            size="sm"
            py={2}
            px={2}
          />
        );
      },
    },
    {
      key: "type",
      label: t("selectionAndExtraction.input.extractionQuestions.type"),
      width: "25%",
      render: (row, index) => {
        const isEditing = editIndex === index;

        if (!isEditing) {
          return (
            <Text
              fontSize="sm"
              color="black"
              whiteSpace="normal"
              wordBreak="break-word"
              textAlign="center"
            >
              {row.type || "—"}
            </Text>
          );
        }

        return (
         <Select
            onChange={(e) => handleSelect(index, e.target.value)}
            placeholder={!row.type ? t("selectionAndExtraction.input.extractionQuestions.selectType") : undefined}
            value={row.type || ""}
            border="solid 1px #303D50"
            bg="white"
            color="black"
            iconColor="#303D50"
            cursor="pointer"
            borderRadius="md"
            size="sm"
          >
            {options
              .filter((opt) => opt && opt.trim() !== "")
              .map((opt, i) => (
                <option key={i} value={opt.toLowerCase()}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
          </Select>
        );
      },
    },
    {
      key: "questionId",
      label: "",
      width: "15%",
      render: (row, index) => (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          <DeleteButton
            index={index}
            handleDelete={() => handleSaveDelete(index)}
          />
          <EditButton
            index={index}
            editIndex={editIndex}
            handleEdit={async () => {
              if (pendingNewIndex !== null && pendingNewIndex !== index) {
                discardPendingNewRow();
              } else if (editIndex !== null && editIndex !== index) {
                await handleSaveEdit(editIndex, true);
              }

              setnumberScale([row.lower || 1, row.higher || 5]);
              setQuestions(row.questions || []);
              setLabeledQuestions(row.scale || {});
              setEditIndex(index);
              setPickManyQuestions(row.questions || []);
              setShowModal(true);
              setModalType(row.type);
            }}
            handleSaveEdit={async () => {
              handleSaveEdit(index, true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <FormLabel mb={4} fontSize="lg">
        {label}
      </FormLabel>

      <DefaultTable<Row>
        columns={columns}
        data={rows}
        enableSorting={true}
        externalSortConfig={sortConfig}
        onExternalSort={setSortConfig}
      />

      <div
        style={{
          marginTop: "1rem",
          marginBottom: "1rem",
          display: "flex",
          gap: "0.5rem",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <EventButton
          text="Add"
          w={"40px"}
          h={"40px"}
          size="sm"
          event={addNewRow}
        />
      </div>

      {showModal && modalType === t("selectionAndExtraction.input.extractionQuestions.questionType.pickList") && (
        <PickListModal
          show={setShowModal}
          questionHolder={setQuestions}
          questions={questions}
          onSave={() => {}}
        />
      )}

      {showModal && modalType === t("selectionAndExtraction.input.extractionQuestions.questionType.numberedScale") && (
        <NumberScaleModal
          show={setShowModal}
          scaleHolder={setnumberScale}
          values={numberScale}
          onSave={() => {}}
        />
      )}

      {showModal && modalType === t("selectionAndExtraction.input.extractionQuestions.questionType.labeledList") && (
        <LabeledScaleModal
          show={setShowModal}
          questionHolder={setLabeledQuestions}
          questions={labeledQuestions}
          onSave={() => {}}
        />
      )}

      {showModal && modalType === t("selectionAndExtraction.input.extractionQuestions.questionType.pickMany") && (
        <PickManyModal
          show={setShowModal}
          optionHolder={setPickManyQuestions}
          options={pickManyQuestions}
          onSave={() => {}}
        />
      )}
    </div>
  );
}