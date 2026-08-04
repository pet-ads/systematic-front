import { useTranslation } from "react-i18next";
import { Flex, Input, Box, Avatar, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import EventButton from "@components/common/buttons/EventButton";
import useToaster from "@components/feedback/Toaster";
import {
  searchCollaboratorCandidates,
  type CollaboratorCandidate,
} from "./services/searchCollaboratorCandidates";
import { inviteCollaborator } from "./services/useInviteCollaborator";
import type { Researcher } from "./services/useFetchCollaborators";

interface Props {
  researchers: Researcher[];
  setResearchers: (r: Researcher[]) => void;
  systematicStudyId: string;
}

const SEARCH_TRIGGER_STEP = 3;

export default function AddResearcher({
  researchers,
  setResearchers,
  systematicStudyId,
}: Props) {
  const { t } = useTranslation("review/planning-protocol");
  const toast = useToaster();

  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<CollaboratorCandidate[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [chosenCandidate, setChosenCandidate] = useState<CollaboratorCandidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastTriggeredLengthRef = useRef(0);

  const alreadyAddedIds = new Set(researchers.map((r) => r.id));
  const filteredCandidates = candidates.filter((c) => !alreadyAddedIds.has(c.id));

  async function fetchCandidates(prefix: string) {
    if (!systematicStudyId || prefix.length < SEARCH_TRIGGER_STEP) return;
    try {
      const results = await searchCollaboratorCandidates({ systematicStudyId, prefix });
      setCandidates(results);
    } catch {
      setCandidates([]);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    setChosenCandidate(null);

    if (Math.abs(value.length - lastTriggeredLengthRef.current) >= SEARCH_TRIGGER_STEP) {
      fetchCandidates(value);
      lastTriggeredLengthRef.current = value.length;
    }
  }

  async function handleAddResearcher() {
    if (!chosenCandidate || isLoading) return;
    setIsLoading(true);

    try {
      const invited = await inviteCollaborator({
        systematicStudyId,
        usernameCollaborator: chosenCandidate.username,
      });

      const newResearcher: Researcher = {
        id: chosenCandidate.id,
        name: invited.collaboratorUsername,
        email: invited.collaboratorEmail,
        role: "reviewer",
        status: "pending",
      };

      setResearchers([...researchers, newResearcher]);

      toast({
        title: t("generalDefinition.input.researchers.toasts.inviteSent.title"),
        description: `${t("generalDefinition.input.researchers.toasts.inviteSent.description")} ${invited.collaboratorUsername}.`,
        status: "success",
      });
    } catch {
      toast({
        title: t("generalDefinition.input.researchers.toasts.inviteError.title"),
        description: t("generalDefinition.input.researchers.toasts.inviteError.description"),
        status: "error",
      });
    } finally {
      setChosenCandidate(null);
      setSearch("");
      setSuggestionsOpen(false);
      setCandidates([]);
      lastTriggeredLengthRef.current = 0;
      setIsLoading(false);
    }
  }

  return (
    <Flex justify="center" py={2}>
      <Flex gap={2} align="center" width="28rem" position="relative">
        <Input
          ref={inputRef}
          style={{ backgroundColor: chosenCandidate ? "#C9D9E5" : "#ffffffff" }}
          flex="1"
          minW={0}
          size="md"
          value={search}
          placeholder={t("generalDefinition.input.researchers.placeholder")}
          onChange={handleInputChange}
          onFocus={() => setSuggestionsOpen(true)}
          onBlur={() => setSuggestionsOpen(false)}
        />

        {suggestionsOpen && search.length >= SEARCH_TRIGGER_STEP && (
          <Box
            position="absolute"
            width="25rem"
            top="100%"
            mt={1}
            bg="white"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            zIndex={10}
          >
            {filteredCandidates.length > 0 ? (
              filteredCandidates.slice(0, 3).map((candidate) => (
                <Flex
                  key={candidate.id}
                  align="center"
                  gap={3}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSearch(`${candidate.username} - ${candidate.email}`);
                    setChosenCandidate(candidate);
                    inputRef.current?.blur();
                  }}
                >
                  <Avatar size="sm" name={candidate.username} bg="#2E4B6C" color="white" />
                  <Text flex="1" fontSize="sm">
                    {candidate.username} - {candidate.email}
                  </Text>
                </Flex>
              ))
            ) : (
              <Text color="gray.500" textAlign="center" p={2}>
                {t("generalDefinition.input.researchers.noResearchersFound")}
              </Text>
            )}
          </Box>
        )}

        <EventButton
          style={{ opacity: chosenCandidate && !isLoading ? 1 : 0.3 }}
          w="40px"
          flexShrink={0}
          onClick={chosenCandidate && !isLoading ? handleAddResearcher : undefined}
          disabled={!chosenCandidate || isLoading}
        />
      </Flex>
    </Flex>
  );
}
