import { useContext, useState } from "react";

import SessionPrev from "./subcomponents/tables/SessionPrev";

import UseDeleteSession from "../../../../../services/useDeleteSession";

import StudyContext from "@features/review/shared/context/StudiesContext";

import { Accordionbtn, accordion } from "../styles";

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

import IAccordionDashBoard from "../../../../../types";
import IdentificationModal from "../../modals/IdentificationModal";
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

  const studiesContext = useContext(StudyContext);

  const context = {
    invalidEntries: studiesContext?.invalidEntries,
    setInvalidEntries: studiesContext?.setInvalidEntries,
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
                      // sessionIndex={index}
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
