import { Flex } from "@chakra-ui/react";
import { flexStyles } from "./styles/flexStyles";
import FlexLayout from "../../components/ui/Flex/Flex";
import Header from "../../components/ui/Header/Header";
import RevisionCard from "./subcomponents/RevisionCard";
import useFetchRevisionCard from "../../hooks/fetch/useFetchRevisionCard";

export default function UserArea() {
  const { cardData } = useFetchRevisionCard("data/revisions.json");

  return (
    <FlexLayout defaultOpen={0} navigationType="Default">
      <Header text="My Systematic Reviews" />
      <Flex sx={flexStyles} w={"85vw"}>
        {cardData.map((data) => {
          return (
            <RevisionCard
              id={data.key}
              title={data.title}
              RevisorNames={data.revisors}
              lastEdition={data.lastChange}
              creation={data.creation}
              isEdited={data.isEdited}
            />
          );
        })}
      </Flex>
    </FlexLayout>
  );
}
