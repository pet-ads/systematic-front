import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";

import IdentificationModal from "../../modals/IdentificationModal";
import DeleteSessionModal from "../../modals/DeleteSessionModal";

import useGetSession from "../../../../../services/useGetSession";

interface DatabaseCardProps {
  text: string;
}

interface Session {
  id: string;
  systematicStudyd: string;
  userId: string;
  searchString: string;
  additionalInfo: string;
  timestamp: string;
  source: string;
  numberOfRelatedStudies: number;
}

export default function DataBaseCard({ text }: DatabaseCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("review/execution-identification");

  const [showModal, setShowModal] = useState(false);
  const [actionModal, setActionModal] = useState<"create" | "update">("create");
  const [sessionId, setSessionId] = useState("");

  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  const { data, mutate } = useGetSession(text);

  const handleCreateSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionId("");
    setActionModal("create");
    setShowModal(true);
  };

  const handleOpenSessionModal = (action: "create" | "update", id: string) => {
    setSessionId(id);
    setActionModal(action);
    setShowModal(true);
  };

  const handleOpenDeleteSessionModal = (session: Session) => {
    setSessionToDelete(session);
    setShowDeleteSessionModal(true);
  };

  const handleNavigateToSession = (id: string, totalItems: number) => {
    navigate(`/review/execution/identification/${id}?totalItems=${totalItems}`);
  };

  return (
    <Box mb="0.2rem" w="100%">
      <Accordion allowMultiple w="100%">
        <AccordionItem
          bg="white"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="sm"
          overflow="hidden"
        >
          <AccordionButton
            p={0}
            w="100%"
            display="flex"
            flexDirection="column"
            _hover={{ bg: "transparent" }}
          >
            <Flex
              w="100%"
              minH="10px"
              bg="#263C56"
              justifyContent="space-between"
              alignItems="center"
              p="1.5rem 1.5rem"
            >
              <Flex flex="1" alignItems="center" gap="0.75rem">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="white"
                  textAlign="left"
                >
                  {text}
                </Text>
              </Flex>

              <Flex gap="0.5rem" alignItems="center">
                <Button
                  size="sm"
                  leftIcon={<AddIcon />}
                  bg="white"
                  color="#263C56"
                  borderRadius="md"
                  transition="all 0.2s ease"
                  _hover={{ bg: "gray.200", transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0)" }}
                  onClick={handleCreateSession}
                >
                  {t("dataBaseCard.addSession")}
                </Button>
              </Flex>
            </Flex>

            <Flex
              w="100%"
              bg="white"
              justifyContent="center"
              alignItems="center"
              py={1.5}
              transition="background 0.2s ease"
              _hover={{ bg: "gray.100" }}
            >
              <AccordionIcon color="gray.500" boxSize={6} />
            </Flex>
          </AccordionButton>

          <AccordionPanel
            pb={4}
            px={4}
            pt={4}
            borderTop="1px solid"
            borderColor="gray.100"
          >
            <TableContainer
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
              <Table variant="simple" size="md">
                <Thead bg="#263C56">
                  <Tr>
                    <Th color="white" textTransform="none" fontSize="sm">
                      {t("dataBaseCard.accordionDashboard.date")}
                    </Th>
                    <Th color="white" textTransform="none" fontSize="sm">
                      {t("dataBaseCard.accordionDashboard.studies")}
                    </Th>
                    <Th
                      color="white"
                      textTransform="none"
                      fontSize="sm"
                      textAlign="right"
                    >
                      {t("dataBaseCard.accordionDashboard.actions")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data && data.length > 0 ? (
                    data.map((session: Session, index: number) => (
                      <Tr
                        key={session.id || index}
                        bg="white"
                        _even={{ bg: "#E2E8F0" }}
                      >
                        <Td color="gray.700">
                          {new Date(session.timestamp).toLocaleDateString("pt-BR")}
                        </Td>
                        <Td color="gray.700">
                          {session.numberOfRelatedStudies}
                        </Td>
                        <Td textAlign="right">
                          <Flex justify="flex-end" gap="0.5rem">
                            <IconButton
                              aria-label="View"
                              icon={<AiOutlineEye size={20} />}
                              size="sm"
                              bg="transparent"
                              color="gray.600"
                              borderRadius="md"
                              transition="all 0.2s"
                              _hover={{ bg: "blue.100", color: "blue.700" }}
                              onClick={() =>
                                handleNavigateToSession(
                                  session.id,
                                  session.numberOfRelatedStudies,
                                )
                              }
                            />
                            <IconButton
                              aria-label="Edit"
                              icon={<AiOutlineEdit size={20} />}
                              size="sm"
                              bg="transparent"
                              color="gray.600"
                              borderRadius="md"
                              transition="all 0.2s"
                              _hover={{ bg: "gray.200", color: "#263C56" }}
                              onClick={() =>
                                handleOpenSessionModal("update", session.id)
                              }
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<AiOutlineDelete size={20} />}
                              size="sm"
                              bg="transparent"
                              color="red.500"
                              borderRadius="md"
                              transition="all 0.2s"
                              _hover={{ bg: "red.100", color: "red.700" }}
                              onClick={() => handleOpenDeleteSessionModal(session)}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td
                        colSpan={3}
                        textAlign="center"
                        color="gray.500"
                        py="2rem"
                      >
                        {t("dataBaseCard.accordionDashboard.notFound")}
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {showDeleteSessionModal && sessionToDelete && (
        <DeleteSessionModal
          show={setShowDeleteSessionModal}
          session={sessionToDelete}
          mutate={mutate}
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