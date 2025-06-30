// External library
import { Box, Card } from "@chakra-ui/react";

// Components
import CardIcon from "./CardIcon";
import CardInfos from "./CardInfos";
import EditionInfos from "./EditionInfos";
import EnterRevisionButton from "./EnterRevisionButton";

// Hook
import useNavigateToPendingStage from "../../../hooks/useNavigateToPendingStage";

// Styles
import { CardInfosConteiner, Cardstyles } from "../styles/revisionCardstyles";

// Type
interface RevisionCardProps {
  revisionId: string;
  id: string;
  title: string;
  RevisorNames: string[];
  status?: string;
  creation: string;
  lastModification?: string;
  isEdited: boolean;
}

export default function RevisionCard({
  revisionId,
  id,
  title,
  RevisorNames,
  lastModification,
  isEdited,
  creation,
}: RevisionCardProps) {
  const { redirectToPendingStage, stage } = useNavigateToPendingStage({
    reviewId: revisionId,
  });

  async function redirectToReview() {
    localStorage.setItem("systematicReviewId", revisionId);
    redirectToPendingStage();
  }

  return (
    <Card sx={Cardstyles} onClick={redirectToReview} cursor="pointer">
      <CardIcon />
      <CardInfos title={title} RevisorNames={RevisorNames} />
      <Box sx={CardInfosConteiner} id={id}>
        <EnterRevisionButton text="Review Info" />
        <EditionInfos
          lastModification={lastModification as string}
          status={stage}
          isEdited={isEdited}
          creation={creation}
        />
      </Box>
    </Card>
  );
}
