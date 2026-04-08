// Components
import NavButton from "@components/common/buttons/NavigationButton";
import ProtocolFormLayout from "../../components/common/protocolForm";
import { Button, Text } from "@chakra-ui/react";
import { reviewCollaborators } from "../../../../../mocks/reviewCollaborators";
import { potentialCollaborators } from "../../../../../mocks/potentialCollaborators";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function ReviewCollaborators() {
  const {
    syncAndNavigate,
  } = useCreateProtocol();

  const id = localStorage.getItem("systematicReviewId") || "";

  const collaborators = reviewCollaborators;

  const potentialCollaboratorsMock = potentialCollaborators;

  const handleAddCollaborator = () => {
    console.log("Add Collaborator");
    console.log(potentialCollaboratorsMock);
  };

  return (
    <ProtocolFormLayout
      headerText="Protocol: Collaborators"
      navButtons={(
        <>
          <NavButton
            event={() =>
              syncAndNavigate(
                `/review/planning/protocol/risk-of-bias-assessment/${id}`
              )
            }
            text="Back"
          />
          <NavButton
            event={() => syncAndNavigate("/review/execution/identification")}
            text="Next"
          />
        </>
      )}
    >
        <Button onClick = {handleAddCollaborator}>Add Collaborator</Button>

        {collaborators.map((collaborator) => (
          <Text>{collaborator.name}</Text>
        ))}
    </ProtocolFormLayout>
  );
}
