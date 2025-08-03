export interface ToasterProps {
  title: string;
  status: "success" | "error" | "warning" | "info" | "loading";
  description: string | undefined;
  duration: "low" | "medium" | "high"
  //isClosable: boolean,
  //position: string
}

export default function useToasterDuration(duration: string) {
  if(duration == 'low'){
    return 4500
  }else if(duration == 'medium'){
    return 6000
  }else{
    return 9000
  }
};
