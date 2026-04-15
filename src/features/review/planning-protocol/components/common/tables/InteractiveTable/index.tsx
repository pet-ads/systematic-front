import { useEffect, useState } from "react";
import { Input, Select, FormLabel, Textarea } from "@chakra-ui/react";
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
  if (label == "Extraction Questions") adress = "extraction-question";
  if (label == "Risk of Bias Questions") adress = "rob-question";

  const toaster = useToaster();
  const validator = useValidatorSQLInjection();

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
                type = "textual";
                break;
              case "PICK_LIST":
                type = "pick list";
                questions = item.options;
                break;
              case "NUMBERED_SCALE":
                type = "number scale";
                break;
              case "LABELED_SCALE":
                type = "labeled list";
                break;
              case "PICK_MANY":
                type = "pick many";
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
    handleTypeChange(index, newValue);
    if (newValue !== "") {
      setModalType(newValue);
      setShowModal(true);
    }
  }

  async function handleSaveEdit(index: number, closeEditMode: boolean = true) {
    if (!validator({ value: rows[index].question })) return;

    if (String(rows[index].id).trim() === "") {
      toaster({
        title: "A reference code is required.",
        description: "Please fill in the Code field before saving.",
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
        title: `The reference code '${currentCode}' is already in use.`,
        description: "Please choose another one.",
        status: "error",
      });
      return;
    }

    const row = rows[index];
    const { question, id: code, type, isNew, questionId: serverId } = row;
    const questionId = code;
    const reviewId = id;

    let data: any;
    let questionType: string | null = null;
    let newQuestionId: string | null = null;

    try {
      if (type === "textual") {
        questionType = "TEXTUAL";
        data = { question, questionId, reviewId };
        if (isNew) newQuestionId = await sendTextualQuestion(data);
        else await updateTextualQuestion(data, serverId, questionType);
      } else if (type === "pick list") {
        questionType = "PICK_LIST";
        data = { question, questionId, reviewId, options: questions };
        handleAddQuestions(index, questions);
        if (isNew) newQuestionId = await sendPickListQuestion(data);
        else await updatePickListQuestion(data, serverId, questionType);
      } else if (type === "number scale") {
        questionType = "NUMBERED_SCALE";
        data = { question, questionId, reviewId, lower: numberScale[0], higher: numberScale[1] };
        handleNumberScale(index, numberScale[0], numberScale[1]);
        if (isNew) newQuestionId = await sendNumberScaleQuestion(data);
        else await updateNumberScaleQuestion(data, serverId);
      } else if (type === "labeled list") {
        questionType = "LABELED_SCALE";
        data = { question, questionId, reviewId, scales: labeledQuestions };
        handleLabeledList(index, labeledQuestions);
        if (isNew) newQuestionId = await sendLabeledListQuestion(data);
        else await updateLabeledListQuestion(data, serverId);
      } else if (type === "pick many") {
        questionType = "PICK_MANY";
        data = { question, questionId, reviewId, options: pickManyQuestions };
        handlePickMany(index, pickManyQuestions);
        if (isNew) newQuestionId = await sendPickManyQuestion(data);
        else await updatePickManyQuestion(data, serverId, questionType);
      }

      if (isNew && newQuestionId) {
        handleServerSend(index, newQuestionId);
      }

      const accessToken = localStorage.getItem("accessToken");
      let optionsReq = { headers: { Authorization: `Bearer ${accessToken}` } };
      await Axios.get(`systematic-study/${id}/protocol/extraction-question`, optionsReq);

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
        title: "Finish editing the current row before adding a new one.",
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
        return (
          <Input
            value={row.id}
            onChange={(e) => handleIdChange(index, e.target.value)}
            maxLength={7}
            isReadOnly={!isEditing}
            border={isEditing ? "solid 1px #303D50" : "transparent"}
            bg={isEditing ? "white" : "transparent"}
            cursor={isEditing ? "text" : "default"}
            _focus={{ boxShadow: isEditing ? "outline" : "none" }}
            borderRadius="md"
            size="sm"
            sx={{ textTransform: "uppercase" }}
          />
        );
      },
    },
    {
      key: "question",
      label: "QUESTION",
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
      label: "TYPE",
      width: "25%",
      render: (row, index) => {
        const isEditing = editIndex === index;
        return (
          <Select
            onChange={(e) => handleSelect(index, e.target.value)}
            value={row.type}
            isDisabled={!isEditing}
            border={isEditing ? "solid 1px #303D50" : "transparent"}
            bg={isEditing ? "white" : "transparent"}
            color="black"
            _disabled={{ opacity: 1, cursor: "default" }}
            borderRadius="md"
            size="sm"
          >
            {options.map((opt, i) => (
              <option key={i} value={opt.toLowerCase()}>
                {opt}
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
    <div>
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

      {showModal && modalType === "pick list" && (
        <PickListModal
          show={setShowModal}
          questionHolder={setQuestions}
          questions={questions}
          onSave={() => {
            if (editIndex !== null) handleSaveEdit(editIndex, false);
          }}
        />
      )}

      {showModal && modalType === "number scale" && (
        <NumberScaleModal
          show={setShowModal}
          scaleHolder={setnumberScale}
          values={numberScale}
          onSave={() => {
            if (editIndex !== null) handleSaveEdit(editIndex, false);
          }}
        />
      )}

      {showModal && modalType === "labeled list" && (
        <LabeledScaleModal
          show={setShowModal}
          questionHolder={setLabeledQuestions}
          questions={labeledQuestions}
          onSave={() => {
            if (editIndex !== null) handleSaveEdit(editIndex, false);
          }}
        />
      )}

      {showModal && modalType === "pick many" && (
        <PickManyModal
          show={setShowModal}
          optionHolder={setPickManyQuestions}
          options={pickManyQuestions}
          onSave={() => {
            if (editIndex !== null) handleSaveEdit(editIndex, false);
          }}
        />
      )}
    </div>
  );
}
