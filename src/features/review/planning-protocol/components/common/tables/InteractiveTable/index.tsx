import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Button, Input, Select, FormLabel } from "@chakra-ui/react";
import Axios from "../../../../../../../infrastructure/http/axiosClient";

import DefaultTable from "@components/common/tables/DefaultTable";
import { Column, SortConfig } from "@components/common/tables/DefaultTable/types";

import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useInteractiveTable, Row } from "../../../../hooks/useInteractiveTable";
import useSendExtractionForm from "../../../../../execution-extraction/services/useSendExtractionForm";
import NumberScaleModal from "../../modals/NumberScaleModal";
import PickListModal from "../../modals/PickListModal";
import PickManyModal from "../../modals/PickManyModal";
import LabeledScaleModal from "../../modals/LabeledScaleModal";

interface Props {
  id: string;
  url: string;
  label: string;
}

export default function InteractiveTable({ id, url, label }: Props) {
  let adress = "";
  if (label == "Extraction Questions") adress = "extraction-question";
  if (label == "Risk of Bias Questions") adress = "rob-question";

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
  } = useSendExtractionForm(adress);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [numberScale, setnumberScale] = useState<number[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [pickManyQuestions, setPickManyQuestions] = useState<string[]>([]);
  const [labeledQuestions, setLabeledQuestions] = useState<
    Record<string, number>
  >({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [sortConfig, setSortConfig] = useState<SortConfig<Row>>(null);

  useEffect(() => {
    setQuestions([]);
    const fetch = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        let options = {
          headers: { Authorization: `Bearer ${accessToken}` },
        };

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
              case "TEXTUAL": type = "textual"; break;
              case "PICK_LIST": type = "pick list"; questions = item.options; break;
              case "NUMBERED_SCALE": type = "number scale"; break;
              case "LABELED_SCALE": type = "labeled list"; break;
              case "PICK_MANY": type = "pick many"; questions = item.options; break;
            }
            return {
              id: item.code,
              question: item.description,
              type: type,
              questionId: item.questionId,
              isNew: false,
              questions: questions,
              higher: item.higher,
              lower: item.lower,
              scale: item.scales,
            };
          }
        );
        setRows(fetchedRows);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };
    fetch();
  }, [id, url, adress, setRows]); // Added dependencies

  function handleSelect(index: number, newValue: string) {
    handleTypeChange(index, newValue);
    if (newValue !== "") {
      setModalType(newValue);
      setShowModal(true);
    }
  }

  async function handleSaveEdit(index: number) {
    const row = rows[index];
    const { question, id: questionId, type, isNew, questionId: serverId } = row;
    const reviewId = id; // From props

    let data: any;
    let questionType: string | null = null;
    let newQuestionId: string | null = null;

    try {
      if (type === "textual") {
        questionType = "TEXTUAL";
        data = { question, questionId, reviewId };
        
        if (isNew) {
          newQuestionId = await sendTextualQuestion(data);
        } else {
          await updateTextualQuestion(data, serverId, questionType);
        }

      } else if (type === "pick list") {
        questionType = "PICK_LIST";
        data = { question, questionId, reviewId, options: questions };
        handleAddQuestions(index, questions);

        if (isNew) {
          newQuestionId = await sendPickListQuestion(data);
        } else {
          await updatePickListQuestion(data, serverId, questionType);
        }

      } else if (type === "number scale") {
        questionType = "NUMBERED_SCALE";
        data = {
          question,
          questionId,
          reviewId,
          lower: numberScale[0],
          higher: numberScale[1],
        };
        handleNumberScale(index, numberScale[0], numberScale[1]);

        if (isNew) {
          newQuestionId = await sendNumberScaleQuestion(data);
        } else {
          await updateNumberScaleQuestion(data, serverId);
        }

      } else if (type === "labeled list") {
        questionType = "LABELED_SCALE";
        data = { question, questionId, reviewId, scales: labeledQuestions };
        handleLabeledList(index, labeledQuestions);

        if (isNew) {
          newQuestionId = await sendLabeledListQuestion(data);
        } else {
          await updateLabeledListQuestion(data, serverId);
        }

      } else if (type === "pick many") {
        questionType = "PICK_MANY";
        data = { question, questionId, reviewId, options: pickManyQuestions };
        handlePickMany(index, pickManyQuestions);

        if (isNew) {
          newQuestionId = await sendPickManyQuestion(data);
        } else {
          await updatePickManyQuestion(data, serverId, questionType);
        }
      }

      if (isNew && newQuestionId) {
        handleServerSend(index, newQuestionId);
      }

    } catch (error) {
      console.error("Failed to save question:", error);
    }

    setEditIndex(null);

    const accessToken = localStorage.getItem("accessToken");
    let options = { headers: { Authorization: `Bearer ${accessToken}` } };
    await Axios.get(`systematic-study/${id}/protocol/extraction-question`, options);
  }

  const handleIdChange = (index: number, newId: string) => {
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, id: newId } : row))
    );
  };

  function addNewRow() {
    addRow(setEditIndex, setQuestions);
    setPickManyQuestions([]);
  }

  

  const columns: Column<Row>[] = [
    {
      key: "id",
      label: "ID",
      width: "10%",
      render: (row, index) => (
        <Input
          value={row.id}
          onChange={(e) => handleIdChange(index, e.target.value)}
          border={"solid 1px #303D50"}
          borderRadius="md"
          size="sm"
          bg="white"
        />
      ),
    },
    {
      key: "question",
      label: "QUESTION",
      width: "40%",
      render: (row, index) => (
        <Input
          value={row.question}
          onChange={(e) => handleQuestionChange(index, e.target.value)}
          border={"solid 1px #303D50"}
          borderRadius="md"
          size="sm"
          bg="white"
        />
      ),
    },
    {
      key: "type",
      label: "TYPE",
      width: "25%",
      render: (row, index) => (
        <Select
          onChange={(e) => handleSelect(index, e.target.value)}
          border={"solid 1px #303D50"}
          borderRadius="md"
          size="sm"
          value={row.type}
          bg="white"
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.toLowerCase()}>
              {opt}
            </option>
          ))}
        </Select>
      ),
    },
    {
      key: "questionId",
      label: "", 
      width: "15%",
      render: (row, index) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <DeleteButton
            index={index}
            handleDelete={() => handleDelete(index)}
          />
          <EditButton
            itemDescription={row.question}
            itemType={row.type}
            index={index}
            editIndex={editIndex}
            handleEdit={() => {
              setnumberScale([row.lower, row.higher]);
              setQuestions(row.questions);
              setLabeledQuestions(row.scale);
              setEditIndex(index);
              setPickManyQuestions(row.questions);
              setShowModal(true);
              setModalType(row.type);
            }}
            handleSaveEdit={async () => {
              handleSaveEdit(index);
            }}
          />
        </div>
      ),
    }
  ];

  return (
    <div>
      <FormLabel color={"#2E4B6C"} mb={4} fontSize="lg" fontWeight="bold">
        {label}
      </FormLabel>

      <DefaultTable<Row>
        columns={columns}
        data={rows}
        enableSorting={true} 
        externalSortConfig={sortConfig} 
        onExternalSort={setSortConfig}
      />

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <Button size="sm" onClick={addNewRow}>
          <AddIcon />
        </Button>
        
      </div>

      {showModal == true && modalType == "pick list" && (
        <PickListModal
          show={setShowModal}
          questionHolder={setQuestions}
          questions={questions}
        />
      )}

      {showModal == true && modalType == "number scale" && (
        <NumberScaleModal
          show={setShowModal}
          scaleHolder={setnumberScale}
          values={numberScale}
        />
      )}

      {showModal == true && modalType == "labeled list" && (
        <LabeledScaleModal
          show={setShowModal}
          questionHolder={setLabeledQuestions}
          questions={labeledQuestions}
        />
      )}

      {showModal == true && modalType == "pick many" && (
        <PickManyModal
          show={setShowModal}
          optionHolder={setPickManyQuestions}
          options={pickManyQuestions}
        />
      )}
    </div>
  );
}

