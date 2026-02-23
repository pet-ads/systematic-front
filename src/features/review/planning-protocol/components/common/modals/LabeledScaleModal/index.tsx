import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Input,
  Flex,
  Thead,
  Th,
} from "@chakra-ui/react";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import EventButton from "@components/common/buttons/EventButton";
import DeleteButton from "@components/common/buttons/DeleteButton";
import EditButton from "@components/common/buttons/EditButton";

import {
  formcontrol,
  label,
} from "@features/review/planning-protocol/components/common/inputs/text/AddTextTable/styles";
import { tbConteiner } from "@features/review/planning-protocol/components/common/tables/InfosTable/styles"; 

interface Props {
  show: Dispatch<SetStateAction<boolean>>;
  questionHolder: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  questions: Record<string, number>;
}

export default function LabeledScaleModal({ show, questionHolder, questions }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [localQuestions, setLocalQuestions] = useState<Record<string, number>>({});
  
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState<number | "">("");

  const [editKey, setEditKey] = useState<string | null>(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [editedValue, setEditedValue] = useState<number | "">("");

  useEffect(() => {
    onOpen();
    if (questions) {
      setLocalQuestions(questions);
    }
  }, [onOpen, questions]);

  function close() {
    show(false);
    onClose();
  }

  const handleAdd = () => {
    const trimmedLabel = newLabel.trim();
    if (!trimmedLabel || newValue === "") return;

    if (localQuestions.hasOwnProperty(trimmedLabel)) {
      alert("This label already exists!");
      return;
    }

    const updated = { ...localQuestions, [trimmedLabel]: Number(newValue) };
    setLocalQuestions(updated);
    questionHolder(updated);

    setNewLabel("");
    setNewValue("");
  };

  const handleDelete = (keyToDelete: string) => {
    const updated = { ...localQuestions };
    delete updated[keyToDelete];
    setLocalQuestions(updated);
    questionHolder(updated);
  };

  const handleEditStart = (key: string, val: number) => {
    setEditKey(key);
    setEditedLabel(key);
    setEditedValue(val);
  };

  const handleSaveEdit = () => {
    const trimmedLabel = editedLabel.trim();
    if (!editKey || !trimmedLabel || editedValue === "") return;

    const updated = { ...localQuestions };

    if (editKey !== trimmedLabel) {
      if (updated.hasOwnProperty(trimmedLabel)) {
        alert("This label already exists!");
        return;
      }
      delete updated[editKey];
    }

    updated[trimmedLabel] = Number(editedValue);

    setLocalQuestions(updated);
    questionHolder(updated);
    setEditKey(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Insert options and values
          <ModalCloseButton onClick={close} />
        </ModalHeader>

        <ModalBody>
          <FormControl sx={label}>
            <FormControl sx={formcontrol}>
              <FormLabel mt={"30px"} fontWeight={500} fontSize={"large"}>
                Labeled Scale
              </FormLabel>

              <TableContainer sx={tbConteiner}>
                <Table variant="simple" size="md">
                  <Thead>
                    <Tr>
                      <Th colSpan={3} padding="1rem">
                        <Flex gap="4" align="center">
                          <Input
                            placeholder="Insert your label here"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            flex="1"
                            size="md"
                          />
                          <Input
                            type="number"
                            placeholder="Value"
                            value={newValue}
                            onChange={(e) =>
                              setNewValue(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            w="100px"
                            size="md"
                          />
                          <EventButton text="Add" event={handleAdd} w={"40px"} />
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.entries(localQuestions).map(([key, val], index) => (
                      <Tr key={index}>
                        <Td whiteSpace={"normal"} wordBreak={"break-word"} py={"1"}>
                          {editKey === key ? (
                            <Input
                              value={editedLabel}
                              onChange={(e) => setEditedLabel(e.target.value)}
                              size="md"
                            />
                          ) : (
                            key
                          )}
                        </Td>

                        <Td w="120px" py={"1"}>
                          {editKey === key ? (
                            <Input
                              type="number"
                              value={editedValue}
                              onChange={(e) =>
                                setEditedValue(e.target.value === "" ? "" : Number(e.target.value))
                              }
                              size="md"
                            />
                          ) : (
                            val
                          )}
                        </Td>

                        <Td textAlign={"right"} py={"1"} w="100px">
                          <Flex gap="2" justify="flex-end">
                            <DeleteButton index={index} handleDelete={() => handleDelete(key)} />
                            <EditButton
                              index={index}
                              editIndex={editKey === key ? index : null}
                              handleEdit={() => handleEditStart(key, val)}
                              handleSaveEdit={handleSaveEdit}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </FormControl>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={close}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}