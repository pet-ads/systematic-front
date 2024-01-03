import { Grid, GridItem, Heading } from "@chakra-ui/react";
import Sidebar from "../../components/ui/NavBar/Sidebar";

export default function NovaRevisao() {
  return (
    <Grid templateColumns={"repeat(3,1fr)"}>
      <Sidebar />

      <GridItem>
        <Heading mt={10} as={"h1"}>
          Criando nova Revisão Sistemática!
        </Heading>
      </GridItem>
    </Grid>
  );
}