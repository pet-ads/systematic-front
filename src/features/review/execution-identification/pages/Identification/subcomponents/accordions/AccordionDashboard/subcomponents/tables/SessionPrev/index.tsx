import { Link } from "react-router-dom";
import useToaster from "@components/feedback/Toaster";
import { motion } from "framer-motion";

import { InvalidEntry } from "@features/review/shared/context/StudiesSelectionContext";

import {
  createFileToInvalidEntries,
  downloadFile,
} from "../../../../../../../../hooks/createFileToInvalidEntries";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex, Button, Text, Tr, Td } from "@chakra-ui/react";
import { FaRegEye } from "react-icons/fa6";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineSdCardAlert } from "react-icons/md";

interface actionsModal {
  action: "create" | "update";
}

interface SessionPrevProps {
  handleOpenModal: (action: actionsModal) => void;
  handleDelete: (id: string) => void;
  timestamp: string;
  numberOfStudies: number;
  sessionId: string;
  invalidEntries: InvalidEntry[] | undefined;
}

const SessionPrev = ({
  handleOpenModal,
  handleDelete,
  timestamp,
  numberOfStudies,
  sessionId,
  invalidEntries,
}: SessionPrevProps) => {
  const toast = useToaster();
  const handleToastAlert = () => {
    toast({
      title: "Studies without references associated",
      description: "There are no references associated with this study",
      status: "info",
    });
  };

  const getDataCurrent = (): string => {
    const date = new Date(timestamp);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month =
      date.getMonth() < 9
        ? `0${date.getMonth() + 1}`
        : `${date.getMonth() + 1}`;
    const year = `${date.getFullYear()}`;
    return `${day}/${month}/${year}`;
  };

  const hasErrorsBySessionId = (id: string) => {
    const has = invalidEntries?.some(
      (entry) => entry?.id === id && entry?.entries?.length > 0
    );
    return has;
  };

  const handleDownloadInvalidFiles = () => {
    const entry = invalidEntries?.find((entry) => entry?.id === sessionId);
    if (!entry) return;

    const { id, fileName, fileExtension, entries } = entry;
    const file = createFileToInvalidEntries({ fileExtension, entries });
    downloadFile(file, `${id}-${fileName}`);
  };

  return (
    <Tr>
      <Td>
        <Text textAlign="center" whiteSpace={"nowrap"} overflow={"hidden"}>
          {getDataCurrent()}
        </Text>
      </Td>
      <Td>
        <Text textAlign="center" width="100%">
          {numberOfStudies}
        </Text>
      </Td>
      <Td>
        <Flex gap="5px">
          {numberOfStudies && numberOfStudies > 0 ? (
            <Button
              as={Link}
              to={`/newReview/identification/${sessionId}`}
              colorScheme="gray"
              height="35px"
              flex={1}
            >
              <FaRegEye />
            </Button>
          ) : (
            <Button
              flex={1}
              colorScheme="gray"
              height="35px"
              onClick={handleToastAlert}
            >
              <IoEyeOffOutline />
            </Button>
          )}
          <Button
            flex={1}
            colorScheme="gray"
            height="35px"
            onClick={() => handleOpenModal({ action: "update" })}
          >
            <EditIcon />
          </Button>
          <Button
            flex={1}
            colorScheme="gray"
            height="35px"
            onClick={() => handleDelete(sessionId)}
          >
            <DeleteIcon />
          </Button>
          {hasErrorsBySessionId(sessionId) && (
            <Button
              flex={1}
              colorScheme="yellow"
              height="35px"
              onClick={handleDownloadInvalidFiles}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <MdOutlineSdCardAlert size="20px" />
              </motion.div>
            </Button>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

export default SessionPrev;
