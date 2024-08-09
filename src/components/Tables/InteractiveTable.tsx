import { AddIcon } from "@chakra-ui/icons";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import { useInteractiveTable } from "../../hooks/useInteractiveTable";
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td, Button, Select, Input, FormLabel } from "@chakra-ui/react";
import useSendExtractionForm from "../../hooks/revisions/extractionForm/useSendExtractionForm";
import axios from "../../interceptor/interceptor";
import PickListModal from "../Modals/Data Extraciton Field Creation/PickListModal";
import { useEffect, useState } from "react";


interface Props{
  id: string;
  url: string;
  label: string
  type: "extractionQuestions" | 'robQuestions';
}

export default function InteractiveTable({id, url, label, type}: Props) {
  const { setRows, rows, addRow, handleDelete, handleQuestionChange, handleTypeChange, options, headers } =
    useInteractiveTable();
  const { sendTextualQuestion, sendPickListQuestion } = useSendExtractionForm();

  const [questions, setQuestions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  
  useEffect(() => {

    const fetch = async () => {
      try {
        let response = await axios.get(url, { withCredentials: true });
  
        let link = response.data._links['find-all-review-extraction-questions'].href;
        response = await axios.get(link, { withCredentials: true });
  
        const fetchedRows = response.data.questions.map(item => {
          let type;
          switch (item.questionType) {
            case 'TEXTUAL':
              type = 'textual';
              break;
            case 'PICK_LIST':
              type = 'pick list';
              break;
            case 'NUMBERED_SCALE':
              type = 'number scale';
              break;
            case 'LABELED_SCALE':
              type = 'labeled list';
              break;
          }
  
          return {
            id: item.code,
            question: item.description,
            type: type
          };
        });
  
        setRows(fetchedRows);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };
  
    fetch();
  }, []);

  useEffect(() => {
    console.log(questions);
  }, [questions])
  
  function handleSelect(index: number, newValue: string){
    handleTypeChange(index, newValue); // Atualiza o tipo primeiro
  
    if (newValue === 'pick list') {
      setModalType(newValue);  // Atualiza o tipo do modal
      setShowModal(true);  // Abre o modal
    }
  }
  

  return (
    <TableContainer>
      <FormLabel  color={"#2E4B6C"}>{label}</FormLabel>
      <Table variant="striped" size="md" w={"60vw"}  borderRadius={"8px"} overflow="hidden">
        <Thead bgColor={"#2E4B6C"}>
          <Tr>
            {headers.map((header) => (
              <Th color={"#DDE4E9"}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          { rows.map((row, index) => (
            <Tr key={index} bgColor={"#C9D9E5"}>
              <Td>{row.id}</Td>
              <Td>
                <Input value={row.question} onChange={(e) => handleQuestionChange(index, e.target.value)}
                border={"solid 1px #303D50"} />
              </Td>
              <Td>
                <Select onChange={(e) => handleSelect(index, e.target.value)} border={"solid 1px #303D50"} value={row.type} >
                  {options.map((opt, i) => (
                    <option key={i} value={opt.toLowerCase()}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>
                <DeleteButton index={index} handleDelete={() => handleDelete(index)} />
                <EditButton
                  index={index}
                  editIndex={index}
                  handleEdit={() => {
                    // handle edit logic
                  }}
                  handleSaveEdit={async () => {
                    // handle save edit logic

                    console.log(rows[index].question, rows[index].type, rows[index].id);
                    if(rows[index].type == "textual"){
                      const data = {
                        question: rows[index].question,
                        questionId: rows[index].id,
                        reviewId: id
                      }

                      sendTextualQuestion(data);
                    } else if(rows[index].type == "pick list"){
                      const data = {
                          question: rows[index].question,
                          questionId: rows[index].id,
                          reviewId: id,
                          options: questions
                      }   
                      
                      sendPickListQuestion(data);
                    }
                    let response = await axios.get(`http://localhost:8080/api/v1/systematic-study/${id}/protocol/extraction-question`, {withCredentials: true});
                    console.log(response);
                  }}
                />
              </Td>
            </Tr>
          ))}
          <Tr bgColor={"#2E4B6C"}>
            <Td></Td>
            <Td colSpan={2}>
              <Button size="sm" leftIcon={<AddIcon />} onClick={addRow}>
                Add Row
              </Button>
            </Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
      {showModal == true && modalType == 'pick list' && (
        <PickListModal show={setShowModal} questionHolder={setQuestions}/>
      )}
      {showModal == true && modalType == 'numbered list' && (
        <PickListModal show={setShowModal} questionHolder={setQuestions}/>
      )}
    </TableContainer>
  );
}