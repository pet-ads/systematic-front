import { Button, Text } from "@chakra-ui/react";
import { potentialResearchers } from "../../../../../../../mocks/potentialResearchers";
import { addedResearchers } from "../../../../../../../mocks/addedResearchers";

export default function ResearcherFilter() {
  const researchers = potentialResearchers;

  const handleAddCollaborator = () => {
    researchers.map((researcher) => {
      console.log(researcher.name);
    });
  };

  return (
    <>
      <Text mt={"30px"} fontWeight={500} fontSize={"large"}>Researchers</Text>
      <Button onClick={handleAddCollaborator}>Add Collaborator</Button>
      {addedResearchers.map((researcher) => (  
        <Text key={researcher.name}>{researcher.name} - {researcher.email} - {researcher.photo}</Text>
      ))}
    </>
  );
}
