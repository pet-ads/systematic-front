import { useEffect, useState } from "react";
import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Flex, Text, Box } from "@chakra-ui/react";
import { Accordionbtn, accordion } from "../../styles/CardsStyle";
import IdentificationModal from "../../../../components/Modals/IdentificationModal";
import SessionPrev from "./SessionPrev";

// hooks
import useGetSession from "../../../../hooks/reviews/useGetSession";
import UseDeleteSession from "../../../../hooks/reviews/useDeleteSession";

interface ActionsModal {
  action: "create" | "update";
}

export default function AccordionDashboard({ type, sessions, setSessions }: IAccordionDashBoard) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionModal, setActionModal] = useState<"create" | "update">("create");

  const getTotalStudiesRelated = () => {
    return sessions.reduce((total, item) => total + item.numberOfRelatedStudies, 0);
  };

  useEffect(() => {
    async function fetchSessions() {
      const response = await useGetSession(type);
      console.log(response.data.searchSessions);
      setSessions(response.data.searchSessions);
    }

    fetchSessions();
  }, [type]);

  const handleOpenModal = ({ action }: ActionsModal) => {
    setActionModal(action);
    setShowModal(true);
  };

  const handleDeleteStudies =  async (id: string) => {
    try {
      await UseDeleteSession(id);
      setSessions(sessions.filter((prevStudies) => prevStudies.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccordionToggle = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <Accordion allowToggle sx={accordion} onChange={handleAccordionToggle}>
      {showModal && (
        <IdentificationModal
          show={setShowModal}
          action={actionModal}
          type={type}
          setSessions={setSessions}
        />
      )}

      <AccordionItem>
        <AccordionButton sx={Accordionbtn}>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          {sessions.length > 0 ? (
            <>
              <Flex
                flex={1}
                fontWeight="bold"
                justifyContent="space-between"
                alignItems="center"
                py={2}
                gap={"3rem"}
              >
                <Flex>
                  <Text textAlign="left" whiteSpace={"nowrap"} overflow={"hidden"}>
                    Date
                  </Text>
                </Flex>

                <Flex flex={1}>
                  <Text textAlign="center">Studies</Text>
                </Flex>
              </Flex>
              <Box maxH="5.5rem" overflowY='auto' pr={2}>
              {sessions.map((item) => (
                <SessionPrev
                  key={item.id}
                  sessionId={item.id}
                  handleOpenModal={handleOpenModal}
                  handleDelete={handleDeleteStudies}
                  timestamp={item.timestamp}
                  numberOfStudies={item.numberOfRelatedStudies}
                />
              ))}
              </Box>
              <Box>
                <Text mt="1rem">Total: {getTotalStudiesRelated()}</Text>
              </Box>
            </>
          ) : (
            <Text>Studies not found</Text>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
