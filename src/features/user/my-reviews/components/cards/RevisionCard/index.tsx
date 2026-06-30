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
  collaborators: string[];
}

export default function RevisionCard({
  revisionId,
  title,
  status,
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
          {t("owner")}: {t("you")}
        </Text>
        
        
        <Box pl="0.5rem" mt="0.25rem">
          {collaborators && collaborators.length > 1 ? (
            <>
              <Text fontSize="0.875rem" color="gray.600">
                {t("reviewers")}:
              </Text>
              {collaborators.map((collab, index) => (
                <Text key={index} fontSize="0.875rem" color="gray.500">
                  {collab}
                </Text>
              ))}
            </>
          ) : (
            <Text fontSize="0.875rem" color="gray.400">{t("reviewers")}: -</Text>
          )}
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