import { Card, Box, Text } from "@chakra-ui/react";
import EventButton from "../../../components/Buttons/EventButton";
import DataBaseIcon from "../../../components/Icons/DataBaseIcon";
import AccordionDashboard from "./subcomponents/AccordionDashboard";
import {
  btnConteiner,
  card,
  conteiner,
  iconConteiner,
  testo,
} from "../styles/CardsStyle";
import IdentificationModal from "../../../components/Modals/IdentificationModal";
import { useEffect, useState } from "react";
import useGetSession from "../../../hooks/reviews/useGetSession";
import DeleteDatabaseModal from "../../../components/Modals/Delete database";
import { AddIcon } from "@chakra-ui/icons";
import { AiOutlineDelete } from "react-icons/ai";

interface DatabaseCardProps {
  text: string;
}

interface actionsModal {
  action: "create" | "update";
}

interface deleteDatabase {
  action: "delete" | "refuse";
}

export default function DataBaseCard({ text }: DatabaseCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [actionModal, setActionModal] = useState<"create" | "update">("create");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setdeleteModal] = useState<"delete" | "refuse">("delete");

  const [sessions, setSessions] = useState<
    {
      id: string;
      systematicStudyd: string;
      userId: string;
      searchString: string;
      additionalInfo: string;
      timestamp: string;
      source: string;
      numberOfRelatedStudies: number;
    }[]
  >([]);

  useEffect(() => {
    async function fetchSessions() {
      let response = await useGetSession(text);
      console.log(response.data.searchSessions);
      setSessions(response.data.searchSessions);
    }

    fetchSessions();
  }, []);

  const handleOpenModal = ({ action }: actionsModal) => {
    setActionModal(action);
    setShowModal(true);
  };

  const handleOpenDeleteModal = ({ action }: deleteDatabase) => {
    setdeleteModal(action);
    setShowDeleteModal(true);
  };

  return (
    <Card sx={card}>
      <Box
        sx={conteiner}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        flexDirection={"row"}
        bgColor={"#EBF0F3"}
        color={"#263C56"}
      >
        <Box sx={iconConteiner} ml={"1em"}>
          <DataBaseIcon />
          <Text sx={testo}> {text}</Text>
        </Box>

        <Box sx={btnConteiner}>
          {
            <EventButton
              fontSize={14}
              bgColor={"#263C56"}
              w={"80px"}
              color={"#EBF0F3"}
              borderRadius="50px"
              icon={<AddIcon />}
              event={function (): void {
                handleOpenModal({ action: "create" });
              }}
              text={"View"}
              onClick={() => handleOpenModal({ action: "create" })}
            />
          }
        </Box>
        <Box sx={btnConteiner}>
          {
            <EventButton
              fontSize={14}
              bgColor={"#263C56"}
              w={"80px"}
              color={"#EBF0F3"}
              icon={<AiOutlineDelete/>}
              borderRadius="50px"
              event={function (): void {
                handleOpenDeleteModal({ action: "delete" });
              }}
              text={"Delete"}
              onClick={() => handleOpenDeleteModal({ action: "delete" })}
            />
          }
        </Box>
      </Box>

      {showDeleteModal && (
        <DeleteDatabaseModal
          show={setShowDeleteModal}
          action={deleteModal}
          sessions={sessions}
          databaseName={text}
          onDeleteAll={() => setSessions([])}
        />
      )}

      <AccordionDashboard
        type={text}
        sessions={sessions}
        setSessions={setSessions}
      />
      {showModal && (
        <IdentificationModal
          show={setShowModal}
          action={actionModal}
          type={text}
          setSessions={setSessions}
        />
      )}
    </Card>
  );
}
