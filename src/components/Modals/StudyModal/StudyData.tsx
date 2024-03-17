import { IconButton, Flex, Input , Stack, Text, Center} from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";

interface IStudyDataFiel {
  studyData: (string | number)[];
}

export default function StudyDataFiel({ studyData }: IStudyDataFiel) {
  return (
    
    <Flex bg="gray.300" w="450px" h="350px" direction={"column"} alignContent={"center"} /*justifyContent={"center"}*/ p="3">
      <Center>
        <Stack direction={"row"} p="2">
          <Text fontSize={"lg"}>Study Data</Text>
          <IconButton aria-label="Edit Study Data" w="28px" h="28px" icon={<FaPen/>}/>
        </Stack>
      </Center>
      <Text align={"center"} fontSize={"xl"} fontWeight={"semibold"}>Titulo do Artigo</Text>
      <Text align={"center"} p="1">Autor SOBRENOME, autor 2 SOBRENOME</Text>
      
      <Text align={"justify"}>
        <Text as="b">Keywords. </Text>aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa aaaaaaaa aaaaaaa aaaaa
      </Text>
      
      {/*studyData.map((cell, cellIndex) => (
        <Input placeholder="cell" key={cellIndex} bg="gray.700" color="black" />
      ))*/}
    </Flex>
  );
}
