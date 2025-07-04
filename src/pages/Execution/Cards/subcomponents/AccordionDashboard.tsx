import { useContext, useState } from "react";

import IdentificationModal from "../../../../components/Modals/IdentificationModal";
import SessionPrev from "./SessionPrev";

import UseDeleteSession from "../../../../hooks/reviews/useDeleteSession";

import StudySelectionContext from "../../../../components/Context/StudiesSelectionContext";

import { Accordionbtn, accordion } from "../../styles/CardsStyle";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from "@chakra-ui/react";

import IAccordionDashBoard from "../../../../../public/interfaces/IAccordionDashboard";
interface actionsModal {
  action: "create" | "update";
}

export default function AccordionDashboard({
  type,
  sessions,
  mutate,
}: IAccordionDashBoard) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionModal, setActionModal] = useState<"create" | "update">("create");

  const selectionContext = useContext(StudySelectionContext);

  const context = {
    invalidEntries: selectionContext?.invalidEntries,
    setInvalidEntries: selectionContext?.setInvalidEntries,
  };

  const getTotalStudiesRelated = () => {
    let totalStudies = 0;

    sessions.map((item) => {
      totalStudies += item.numberOfRelatedStudies;
    });

    return totalStudies;
  };

  const handleOpenModal = ({ action }: actionsModal) => {
    setActionModal(action);
    setShowModal(true);
  };

  const handleDeleteStudies = (id: string) => {
    UseDeleteSession({ sessionId: id, mutate });
  };

  const handleAccordionToggle = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
      <Accordion allowToggle sx={accordion} onChange={handleAccordionToggle}>
        {showModal == true && (
          <IdentificationModal
            show={setShowModal}
            action={actionModal}
            type={type}
            mutate={mutate}
          />
        )}
        <AccordionItem>
          <AccordionButton sx={Accordionbtn}>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {sessions && sessions.length > 0 ? (
              <Box maxH="10rem" overflowY="auto" overflowX="hidden">
                <Table>
                  <Thead>
                    <Tr>
                      <Th
                        textAlign="center"
                        fontWeight="bold"
                        color="white"
                        textTransform="capitalize"
                        fontSize="md"
                      >
                        Date
                      </Th>
                      <Th
                        textAlign="center"
                        fontWeight="bold"
                        color="white"
                        textTransform="capitalize"
                        fontSize="md"
                      >
                        Studies
                      </Th>
                      <Th
                        textAlign="center"
                        fontWeight="bold"
                        color="white"
                        textTransform="capitalize"
                        fontSize="md"
                      >
                        Actions
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sessions.map((item, index) => (
                      <SessionPrev
                        key={index}
                        sessionId={item.id}
                        handleOpenModal={handleOpenModal}
                        handleDelete={handleDeleteStudies}
                        invalidEntries={context.invalidEntries}
                        sessionIndex={index}
                        timestamp={item.timestamp}
                        numberOfStudies={item.numberOfRelatedStudies}
                      />
                    ))}
                  </Tbody>
                </Table>
              </Box>
            ) : (
              <Text>Studies not found</Text>
            )}
            {sessions.length > 0 && (
              <Box>
                <Text mt="1rem">Total: {getTotalStudiesRelated()}</Text>
              </Box>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
  );
}
