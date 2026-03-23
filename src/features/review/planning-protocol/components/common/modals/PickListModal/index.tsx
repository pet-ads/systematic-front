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
  questionHolder: React.Dispatch<React.SetStateAction<string[]>>;
  questions: string[];
  onSave: () => void;
}

export default function PickListModal({ show, questionHolder, questions, onSave }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [newOption, setNewOption] = useState("");
  
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState("");

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  function close() {
    onSave();
    show(false);
    onClose();
  }

  const handleAdd = () => {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    
    if (questions.includes(trimmed)) {
      alert("This option already exists!");
      return;
    }
    
    questionHolder((prev) => [...prev, trimmed]);
    setNewOption("");
  };

  const handleDelete = (indexToDelete: number) => {
    questionHolder((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  const handleEditStart = (index: number, val: string) => {
    setEditIndex(index);
    setEditedValue(val);
  };

  const handleSaveEdit = () => {
    const trimmed = editedValue.trim();
    if (editIndex === null || !trimmed) return;

    if (questions.includes(trimmed) && questions.indexOf(trimmed) !== editIndex) {
      alert("This option already exists!");
      return;
    }

    questionHolder((prev) => {
      const updated = [...prev];
      updated[editIndex] = trimmed;
      return updated;
    });
    setEditIndex(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} size="2xl">
      <ModalOverlay />
      <ModalContent minH="60vh" display="flex" flexDirection="column">
        <ModalHeader>
          Insert the options
          <ModalCloseButton onClick={close} />
        </ModalHeader>

        <ModalBody pb={6} display="flex" flexDirection="column">
          <FormControl sx={label} flex="1" display="flex" flexDirection="column">
            <FormControl sx={formcontrol} flex="1" display="flex" flexDirection="column">
              <FormLabel mt={"30px"} fontWeight={500} fontSize={"large"}>
                Options
              </FormLabel>

              <TableContainer
                sx={tbConteiner}
                minH={{ base: "250px", md: "400px" }}
                maxH="60vh"
                overflowY="auto"
                flex="1"
              >
                <Table variant="simple" size="md">
                  <Thead>
                    <Tr>
                      <Th colSpan={2} padding="1rem">
                        <Flex gap="4" align="center">
                          <Input
                            placeholder="Enter options here"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            flex="1"
                            size="md"
                          />
                          <EventButton text="Add" event={handleAdd} w={"40px"} />
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {questions.map((opt, index) => (
                      <Tr key={index}>
                        <Td whiteSpace={"normal"} wordBreak={"break-word"} py={3}>
                          {editIndex === index ? (
                            <Input
                              value={editedValue}
                              onChange={(e) => setEditedValue(e.target.value)}
                              size="md"
                            />
                          ) : (
                            opt
                          )}
                        </Td>

                        <Td textAlign={"right"} py={3} w="100px">
                          <Flex gap="2" justify="flex-end">
                            <DeleteButton index={index} handleDelete={() => handleDelete(index)} />
                            <EditButton
                              index={index}
                              editIndex={editIndex === index ? index : null}
                              handleEdit={() => handleEditStart(index, opt)}
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