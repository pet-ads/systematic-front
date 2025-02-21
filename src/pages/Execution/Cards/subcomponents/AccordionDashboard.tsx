// External libraries
import { useContext, useState } from "react";

// Components
import IdentificationModal from "../../../../components/Modals/IdentificationModal";
import SessionPrev from "./SessionPrev";

// Hook
import UseDeleteSession from "../../../../hooks/reviews/useDeleteSession";

// Context
import StudySelectionContext, {
  StudySelectionProvider,
} from "../../../../components/Context/StudiesSelectionContext";

// Styles
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

// Types
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

  // Functions
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
    <StudySelectionProvider>
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
              <Box maxH="10rem" overflowY="auto">
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
            <Box>
              <Text mt="1rem">Total: {getTotalStudiesRelated()}</Text>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </StudySelectionProvider>
  );
}
