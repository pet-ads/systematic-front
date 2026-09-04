import { useTranslation } from "react-i18next";
import { ChevronDownIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import useToaster from "@components/feedback/Toaster";
import { removeCollaborator } from "./services/useRemoveCollaborator";
import { updateResearcherRole } from "./services/useUpdateResearcherRole";
import type { Researcher } from "./services/useFetchCollaborators";

interface Props {
  researchers: Researcher[];
  setResearchers: (r: Researcher[]) => void;
  systematicStudyId: string;
}

const AVAILABLE_ROLES = ["viewer", "reviewer", "editor", "admin"] as const;
type Role = (typeof AVAILABLE_ROLES)[number];

export default function IncludedResearchers({
  researchers,
  setResearchers,
  systematicStudyId,
}: Props) {
  const { t } = useTranslation("review/planning-protocol");
  const toast = useToaster();
  const cancelRef = useRef<HTMLButtonElement>(null!);

  const [researcherToDelete, setResearcherToDelete] = useState<Researcher | null>(null);
  const [isDeletingIncluded, setIsDeletingIncluded] = useState(false);
  const [editingResearcherId, setEditingResearcherId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role>("reviewer");
  const [isSavingRole, setIsSavingRole] = useState(false);

  const [listedResearchers, setListedResearchers] = useState<Researcher[]>([]);

  useEffect(() => {
    setListedResearchers([
      ...researchers.filter((r) => r.status === "pending"),
      ...researchers.filter((r) => r.status === "expired"),
      ...researchers.filter((r) => r.status === "included"),
    ]);
  }, [researchers]);

  async function handleDelete() {
    if (!researcherToDelete) return;

    setIsDeletingIncluded(true);

    try {
      await removeCollaborator({
        systematicStudyId,
        researcherId: researcherToDelete.id,
        status: researcherToDelete.status,
      });
    } catch {
      toast({
        title: t("generalDefinition.input.researchers.toasts.removeError.title"),
        description: t("generalDefinition.input.researchers.toasts.removeError.description"),
        status: "error",
      });
      setResearcherToDelete(null);
      return;
    } finally {
      setIsDeletingIncluded(false);
    }

    setResearchers(researchers.filter((r) => r.id !== researcherToDelete.id));
    setResearcherToDelete(null);
  }

  async function handleSaveRole() {
    if (!editingResearcherId || !editingRole || isSavingRole) return;
    setIsSavingRole(true);

    try {
      await updateResearcherRole({
        systematicStudyId,
        researcherId: editingResearcherId,
        role: editingRole,
      });

      setResearchers(
        researchers.map((r) =>
          r.id === editingResearcherId ? { ...r, role: editingRole } : r
        )
      );

      toast({
        title: t("generalDefinition.input.researchers.toasts.roleUpdated.title"),
        status: "success",
      });
    } catch {
      toast({
        title: t("generalDefinition.input.researchers.toasts.roleUpdateError.title"),
        description: t("generalDefinition.input.researchers.toasts.roleUpdateError.description"),
        status: "error",
      });
    } finally {
      setEditingResearcherId(null);
      setEditingRole("reviewer");
      setIsSavingRole(false);
    }
  }

  return (
    <>
      {listedResearchers.map((researcher) => (
        <Flex
          key={researcher.id}
          align="center"
          gap={5}
          px={4}
          py={2}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
        >
          <Avatar size="sm" name={researcher.name} bg="#2E4B6C" color="white" />

          <Flex
            align={{ base: "flex-start", xl: "center" }}
            justify="space-between"
            flex="1"
            direction={{ base: "column", xl: "row" }}
            gap={{ base: 2, xl: 0 }}
          >
            <Text wordBreak="break-word" pr={{ base: 0, xl: 4 }}>
              {researcher.name} - {researcher.email}
            </Text>

            <Flex
              alignItems="center"
              justifyContent={{ base: "space-between", xl: "flex-end" }}
              gap={5}
              w={{ base: "100%", xl: "auto" }}
            >
              {(researcher.status === "pending" ||
                researcher.status === "expired" ||
                (researcher.status as string) === "excluding") && (
                <Text color="gray.500">
                  {t(`generalDefinition.input.researchers.status.${researcher.status}`)}
                </Text>
              )}
              {researcher.status === "included" ? (
                <>
                  {editingResearcherId === researcher.id ? (
                    <Menu>
                      <MenuButton
                        as={Button}
                        variant="ghost"
                        size="sm"
                        rightIcon={<ChevronDownIcon w={18} h={18} />}
                        fontWeight="normal"
                        fontSize={16}
                        h="100%"
                        w={{ base: "auto", xl: "200px" }}
                        p="0"
                        textAlign="start"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        lineHeight="40px"
                        borderInline="3px solid transparent"
                        outline="1px solid black"
                      >
                        {`${t("generalDefinition.input.researchers.role.role")}: ${t(
                          `generalDefinition.input.researchers.role.${editingRole}`
                        )}`}
                      </MenuButton>
                      <MenuList>
                        {AVAILABLE_ROLES.map((role) => (
                          <MenuItem key={role} onClick={() => setEditingRole(role)}>
                            {t(`generalDefinition.input.researchers.role.${role}`)}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  ) : (
                    <Text
                      w={{ base: "auto", xl: "200px" }}
                      h="100%"
                      borderInline="3px solid transparent"
                      p={0}
                      display="flex"
                      alignItems="center"
                      lineHeight="20px"
                    >
                      {`${t("generalDefinition.input.researchers.role.role")}: ${t(
                        `generalDefinition.input.researchers.role.${researcher.role}`
                      )}`}
                    </Text>
                  )}
                  <Flex>
                    <Button
                      variant="ghost"
                      isLoading={isSavingRole && editingResearcherId === researcher.id}
                      onClick={() => {
                        if (editingResearcherId === researcher.id) {
                          handleSaveRole();
                        } else {
                          setEditingResearcherId(researcher.id);
                          setEditingRole(researcher.role as Role);
                        }
                      }}
                    >
                      {editingResearcherId === researcher.id ? (
                        <i
                          className="pi pi-save"
                          style={{ color: "black", width: "15px", height: "15px" }}
                        />
                      ) : (
                        <Icon as={EditIcon} w="15px" h="15px" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setResearcherToDelete(researcher)}
                    >
                      <Icon as={DeleteIcon} w="15px" h="15px" />
                    </Button>
                  </Flex>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setResearcherToDelete(researcher)}
                >
                  <Icon as={DeleteIcon} w="15px" h="15px" />
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      ))}
      <AlertDialog
        isOpen={!!researcherToDelete}
        leastDestructiveRef={cancelRef}
        onClose={() => setResearcherToDelete(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader color="#2E4B6C" fontSize="lg" fontWeight="bold">
              {t("generalDefinition.input.researchers.confirm.title")}
            </AlertDialogHeader>

            <AlertDialogBody color="#2E4B6C">
              {`${t("generalDefinition.input.researchers.confirm.body")} `}
              <strong>{researcherToDelete?.name}</strong>?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setResearcherToDelete(null)}>
                {t("generalDefinition.input.researchers.confirm.cancel")}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                isLoading={isDeletingIncluded}
                ml={3}
              >
                {t("generalDefinition.input.researchers.confirm.delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
