import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Button
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";

import DataBaseIcon from "../../icons/DatabaseIcon";
import DeleteDatabaseModal from "../../modals/DeleteDatabase";
import IdentificationModal from "../../modals/IdentificationModal";

import useGetSession from "../../../../../services/useGetSession";
import UseDeleteSession from "../../../../../services/useDeleteSession";

interface DatabaseCardProps {
  text: string;
}

export default function DataBaseCard({ text }: DatabaseCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [actionModal, setActionModal] = useState<"create" | "update">("create");
  const [sessionId, setSessionId] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setdeleteModal] = useState<"delete" | "refuse">("delete");

  const { data, mutate } = useGetSession(text);

  const handleCreateSession = () => {
    setSessionId("");
    setActionModal("create");
    setShowModal(true);
  };

  const handleOpenSessionModal = (action: "create" | "update", id: string) => {
    setSessionId(id);
    setActionModal(action);
    setShowModal(true);
  };

  const handleDeleteSession = (id: string) => {
    UseDeleteSession({ sessionId: id, mutate });
  };

  const handleOpenDeleteModal = (action: "delete" | "refuse") => {
    setdeleteModal(action);
    setShowDeleteModal(true);
  };

  return (
    <Box
      w="100%"
      bg="white"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      mb="2rem"
      boxShadow="sm"
    >
      {/* CABEÇALHO DO CARD */}
      <Flex
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        p="1rem 1.5rem"
        bg="white"
      >
        <Flex alignItems="center" gap="0.75rem">
          <DataBaseIcon />
          <Text fontSize="lg" fontWeight="bold" color="#263C56">
            {text}
          </Text>
        </Flex>

        <Flex gap="0.5rem">
          <Button
            size="sm"
            leftIcon={<AddIcon />}
            bg="#263C56"
            color="white"
            _hover={{ bg: "#1a2a3c" }}
            onClick={handleCreateSession}
          >
            Add Session
          </Button>
          <IconButton
            aria-label="Delete Database"
            size="sm"
            icon={<AiOutlineDelete />}
            colorScheme="red"
            variant="outline"
            onClick={() => handleOpenDeleteModal("delete")}
          />
        </Flex>
      </Flex>

      {/* TABELA COM FORMATAÇÃO DE DATA E ESTILO ZEBRA */}
      <TableContainer
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        m="0 1.5rem 1.5rem 1.5rem"
      >
        <Table variant="simple" size="md">
          <Thead bg="#263C56">
            <Tr>
              <Th color="white" textTransform="none" fontSize="sm">Date</Th>
              <Th color="white" textTransform="none" fontSize="sm">Studies</Th>
              <Th color="white" textTransform="none" fontSize="sm" textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data && data.length > 0 ? (
              data.map((session: any, index: number) => (
                <Tr 
                  key={session.id || index} 
                  bg="white" 
                  _even={{ bg: "#E2E8F0" }} 
                  _hover={{ bg: "gray.100" }} 
                  transition="background 0.2s"
                >
                  {/* DATA FORMATADA AQUI */}
                  <Td color="gray.700">
                    {new Date(session.timestamp).toLocaleDateString("pt-BR")}
                  </Td>
                  
                  <Td color="gray.700">{session.numberOfRelatedStudies}</Td>
                  <Td textAlign="right">
                    <Flex justify="flex-end" gap="0.5rem">
                      <IconButton
                        aria-label="View"
                        icon={<AiOutlineEye />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenSessionModal("update", session.id)}
                      />
                      <IconButton
                        aria-label="Edit"
                        icon={<AiOutlineEdit />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenSessionModal("update", session.id)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<AiOutlineDelete />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDeleteSession(session.id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={3} textAlign="center" color="gray.500" py="2rem">
                  No sessions found for this database.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* MODAIS */}
      {showDeleteModal && (
        <DeleteDatabaseModal
          show={setShowDeleteModal}
          action={deleteModal}
          sessions={data}
          mutate={mutate}
          databaseName={text}
        />
      )}

      {showModal && (
        <IdentificationModal
          sessionId={sessionId}
          show={setShowModal}
          action={actionModal}
          type={text}
          mutate={mutate}
        />
      )}
    </Box>
  );
}