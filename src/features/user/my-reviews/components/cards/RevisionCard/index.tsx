// External library
import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// Services
import useNavigateToPendingStage from "@features/user/my-reviews/services/useNavigateToPendingStage";

// Types
interface RevisionCardProps {
  revisionId: string;
  title: string;
  status?: string;
  owner: string;
  collaborators: {
    id: string;
    username: string;
    role: string;
  }[];
}

export default function RevisionCard({
  revisionId,
  title,
  status,
  owner,
  collaborators,
}: RevisionCardProps) {
  const { t } = useTranslation("user/my-reviews");
  const { redirectToPendingStage, stage } = useNavigateToPendingStage({
    reviewId: revisionId,
  });

  async function redirectToReview() {
    localStorage.setItem("systematicReviewId", revisionId);
    redirectToPendingStage();
  }

  const displayStatus = status || stage || "...";

  const collaboratorsList =
    collaborators && collaborators.length > 0
      ? collaborators
          .map(
            (collaborator) =>
              `${collaborator.username.toLowerCase()} (${collaborator.role.toLowerCase()})`
          )
          .join(", ")
      : "-";

  return (
    <Flex 
      w="100%" 
      justify="space-between" 
      p="1rem"
      borderRadius="0.5rem" 
      borderBottom="1px solid" 
      borderColor="gray.200"
      onClick={redirectToReview} 
      cursor="pointer"
      _hover={{ backgroundColor: "gray.50" }}
      transition="background-color 0.2s"
    >
      <Box color="#334155"> 
        <Text fontWeight="600" fontSize="1rem" mb="0.25rem">
          {title}
        </Text>
        
        <Text fontSize="0.875rem" color="gray.600" mb="0.25rem">
          {t("owner")}: {owner}
        </Text>
        
        
        <Box mt="0.25rem">
          <Text fontSize="0.875rem" color="gray.600">
            {t("reviewers")}: {collaboratorsList}
          </Text>
        </Box>
      </Box>

      <Flex alignItems="center">
        <Text fontSize="0.875rem" color="#334155">
          {t("statusLabel")}: {displayStatus}
        </Text>
      </Flex>
    </Flex>
  );
}