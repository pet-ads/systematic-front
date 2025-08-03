import { useToast } from "@chakra-ui/react";
import useToasterDuration, { ToasterProps } from "@features/shared/toaster/createToaster";

export default function useToaster() {
  const toast = useToast();

  return ({ title, status, description, duration }: ToasterProps) => {
    toast({
      title,
      status,
      description,
      duration: useToasterDuration(duration),
      isClosable: true,
      position: "top",
    });
  };
}


