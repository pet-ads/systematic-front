// Components
import NavButton from "@components/common/buttons/NavigationButton";
import ProtocolFormLayout from "../../components/common/protocolForm";
import { Text, Button } from "@chakra-ui/react";

// Service
import useCreateProtocol from "../../services/useCreateProtocol";

export default function ReviewCollaborators() {
  const {
    syncAndNavigate,
  } = useCreateProtocol();

  const id = localStorage.getItem("systematicReviewId") || "";

  const handleAddCollaborator = () => {
    console.log("Add Collaborator");
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
    </ProtocolFormLayout>
  );
}
