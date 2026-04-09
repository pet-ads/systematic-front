import { Text } from "@chakra-ui/react";
import { potentialResearchers } from "../../../../../../../mocks/potentialResearchers";

export default function ResearcherFilter() {
  const researchers = potentialResearchers;

  return (
    <>
      <Text>Researchers</Text>
      {researchers.map((researcher) => (  
        <Text key={researcher.name}>{researcher.name} - {researcher.email} - {researcher.photo}</Text>
      ))}
    </>
  );
}
