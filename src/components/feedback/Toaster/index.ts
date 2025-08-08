import { useToast } from "@chakra-ui/react";

type Status = "success" | "error" | "warning" | "info" | "loading";
type Position = "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";

interface ToasterProps {
  title: string;
  status: Status;
  description?: string;
  duration?: number
  isClosable?: boolean,
  position?: Position
}

export default function useToaster() {
  const toast = useToast();

  return ({ title, status, description, duration, isClosable, position}: ToasterProps) => {
    toast({
      title,
      status,
      description,
      duration: duration ? duration : 4500,
      isClosable: isClosable ? isClosable : true,
      position: position ? position : "top",
    });
  };
}

