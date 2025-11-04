import { AddIcon } from "@chakra-ui/icons";
import EditButton from "@components/common/buttons/EditButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import { useInteractiveTable } from "../../../../hooks/useInteractiveTable";
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import useSendExtractionForm from "../../../../../execution-extraction/services/useSendExtractionForm";
import Axios from "../../../../../../../infrastructure/http/axiosClient";
import { useEffect, useState } from "react";
import NumberScaleModal from "../../modals/NumberScaleModal";
import PickListModal from "../../modals/PickListModal";
import PickManyModal from "../../modals/PickManyModal";
import LabeledScaleModal from "../../modals/LabeledScaleModal";
import useValidatorSQLInjection from "@features/shared/hooks/useValidatorSQLInjection";

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
    headers,
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

  const validator = useValidatorSQLInjection();

  useEffect(() => {
    console.log(adress);

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
            console.log(item);

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
  }, []);

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  function handleSelect(index: number, newValue: string) {
    handleTypeChange(index, newValue); // Atualiza o tipo primeiro

    if (newValue !== "") {
      setModalType(newValue);
      setShowModal(true);
    }
  }

  async function handleSaveEdit(index: number) {
    if(!validator({value: rows[index].question})){
      return
    }
    console.log(rows[index].question, rows[index].type, rows[index].id);
    if (rows[index].type == "textual") {
      const data = {
        question: rows[index].question,
        questionId: rows[index].id,
        reviewId: id,
      };

      let questionId;
      let questionType = "TEXTUAL";
      if (rows[index].isNew) questionId = await sendTextualQuestion(data);
      else updateTextualQuestion(data, rows[index].questionId, questionType);

      handleServerSend(index, questionId);
    } else if (rows[index].type == "pick list") {
      const data = {
        question: rows[index].question,
        questionId: rows[index].id,
        reviewId: id,
        options: questions,
      };

      handleAddQuestions(index, questions);
      let questionId;
      if (rows[index].isNew) questionId = await sendPickListQuestion(data);
      else updatePickListQuestion(data, rows[index].questionId, "PICK_LIST");
      handleServerSend(index, questionId);
    } else if (rows[index].type == "number scale") {
      console.log(rows[index]);
      const data = {
        question: rows[index].question,
        questionId: rows[index].id,
        reviewId: id,
        lower: numberScale[0],
        higher: numberScale[1],
      };

      console.log(data);

      handleNumberScale(index, numberScale[0], numberScale[1]);
      let questionId;
      if (rows[index].isNew) questionId = await sendNumberScaleQuestion(data);
      else updateNumberScaleQuestion(data, rows[index].questionId);
      handleServerSend(index, questionId);
    } else if (rows[index].type == "labeled list") {
      const data = {
        question: rows[index].question,
        questionId: rows[index].id,
        reviewId: id,
        scales: labeledQuestions,
      };

      handleLabeledList(index, labeledQuestions);
      let questionId;
      if (rows[index].isNew) questionId = await sendLabeledListQuestion(data);
      else updateLabeledListQuestion(data, rows[index].questionId);
      handleServerSend(index, questionId);
    } else if (rows[index].type == "pick many") {
      const data = {
        question: rows[index].question,
        questionId: rows[index].id,
        reviewId: id,
        options: pickManyQuestions,
      };

      handlePickMany(index, pickManyQuestions);

      let questionId;
      if (rows[index].isNew) questionId = await sendPickManyQuestion(data);
      else updatePickManyQuestion(data, rows[index].questionId, "PICK_MANY");
      handleServerSend(index, questionId);
    }

    const accessToken = localStorage.getItem("accessToken");
    let options = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    setEditIndex(null);
    await Axios.get(
      `systematic-study/${id}/protocol/extraction-question`,
      options
    );
  }

  function addNewRow() {
    addRow(setEditIndex, setQuestions);
    setPickManyQuestions([]);
  }

  return (
    <TableContainer>
      <FormLabel color={"#2E4B6C"}>{label}</FormLabel>
      <Table
        variant="striped"
        size="md"
        w={"60vw"}
        borderRadius={"8px"}
        overflow="hidden"
      >
        <Thead bgColor={"#2E4B6C"}>
          <Tr>
            {headers.map((header) => (
              <Th color={"#DDE4E9"}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, index) => (
            <Tr key={index} bgColor={"#C9D9E5"}>
              <Td>{row.id}</Td>
              <Td>
                <Input
                  value={row.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  border={"solid 1px #303D50"}
                />
              </Td>
              <Td>
                <Select
                  onChange={(e) => handleSelect(index, e.target.value)}
                  border={"solid 1px #303D50"}
                  value={row.type}
                >
                  {options.map((opt, i) => (
                    <option key={i} value={opt.toLowerCase()}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>
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
                    console.log(row);
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
              </Td>
            </Tr>
          ))}
          <Tr bgColor={"#2E4B6C"}>
            <Td></Td>
            <Td colSpan={2}>
              <Button size="sm" onClick={addNewRow}>
                <AddIcon />
              </Button>
            </Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
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
    </TableContainer>
  );
}
