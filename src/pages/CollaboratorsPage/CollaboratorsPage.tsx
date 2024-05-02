import { Flex, Heading } from "@chakra-ui/react";
import Header from "../Homepage/subcomponents/Header/Header";
import CollaboratorCard from "./subcomponents/collaboratorCards";
import useFecthCollaboratorsInfo from "../../hooks/fetch/useFetchCollaboratorsInfo";
import Footer from "../Homepage/subcomponents/Footer/Footer";

export default function CollaboratorsPage() {
  const { collabInfos } = useFecthCollaboratorsInfo("/data/collaboratorsInfo.json");
  console.log(collabInfos);

  return (
    <Flex direction={"column"} justify={"space-between"} bgColor={"#C9D9E5"}>
      <Header show={false} />
      <Flex mt="150px" mb="50px" h="100%" alignItems={"center"} direction={"column"}>
        <Heading>Colaboradores</Heading>
        <Flex wrap={"wrap"} h="100%" align="center" justify="center" gap={10}>
          {collabInfos.map((person) => {
            return <CollaboratorCard collaborator={person} />;
          })}
        </Flex>
      </Flex>
      <Footer />
    </Flex>
  );
}
