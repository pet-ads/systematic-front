import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex, Button, Text } from "@chakra-ui/react";
import { FaRegEye } from "react-icons/fa6";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { MdOutlineSdCardAlert } from "react-icons/md";


interface actionsModal {
  action: "create" | "update";
}

interface inspectArticlesModal {
  action: "inspect" | "refuse";
}
interface Props {
  handleOpenModal: (action: actionsModal) => void;
  handleDelete: (id: string) => void;
  handleInspectOpenModal : (action: inspectArticlesModal) => void;
  timestamp: string;
  numberOfStudies: number;
  sessionId: string;
}

const SessionPrev = ({
  handleOpenModal,
  handleDelete,
  timestamp,
  numberOfStudies,
  sessionId,
  handleInspectOpenModal,
}: Props) => {
  const date = new Date(timestamp);
  let day, month;
  const toast = useToast();

  const handleToastAlert = () => {
    toast({
      title: "Studies without references associated",
      description: "There are no references associated with this study",
      status: "info",
      duration: 4500,
      isClosable: true,
      position: 'top'
    });
  }

  day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  if (date.getMonth() < 9) month = `0${date.getMonth() + 1}`;
  else month = `${date.getMonth() + 1}`;

  const sessionDate = day + "/" + month;

  return (
    <Flex
      flex={1}
      justifyContent="space-between"
      alignItems="center"
      gap={"10px"}
    >
        <Flex gap="3rem">
            <Text
            textAlign="left"
            width="100%"
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
        >
            {sessionDate}
        </Text>
        
        <Text flex="1" textAlign="center" gap='10px'>
            {numberOfStudies}
        </Text>
        </Flex>
      <Flex justifyContent="flex-end" mt={2} gap="5px">
     

        {numberOfStudies && numberOfStudies > 0 ? (
          <Button
            as={Link}
            to={`/newReview/identification/${sessionId}`}
            flex={1}
            colorScheme="gray"
            height={"35px"}
          >
            <FaRegEye />
          </Button>
        ) : (
          <Button flex={1} colorScheme="gray" height={"35px"} onClick={() => handleToastAlert()}>
            <IoEyeOffOutline />
          </Button>
        )}
        <Button
          flex={1}
          colorScheme="gray"
          height={"35px"}
          onClick={() => handleOpenModal({ action: "update" })}
        >
          <EditIcon />
        </Button>

        <Button
          flex={1}
          colorScheme="gray"
          height={"35px"}
          onClick={() => handleDelete(sessionId)}
        >
          <DeleteIcon />
        </Button>
        <Button
          flex={1}
          colorScheme="gray"
          height={"35px"}
          onClick={() => handleInspectOpenModal({ action: "inspect" })}
        >
          <MdOutlineSdCardAlert />
        </Button>
      </Flex>
    </Flex>
  );
};

export default SessionPrev;
