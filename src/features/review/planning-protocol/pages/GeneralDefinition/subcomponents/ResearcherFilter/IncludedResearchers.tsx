import { useTranslation } from "react-i18next";
import { ChevronDownIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Avatar,
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

const AVAILABLE_ROLES = ["admin", "reviewer", "owner"] as const;

export default function IncludedResearchers({researchers, setResearchers}:any) {
  const { t } = useTranslation("review/planning-protocol"); 

  const [researcherToDelete, setResearcherToDelete] = useState<any>(null);
  
  const cancelRef = useRef<HTMLButtonElement>(null!);

  // Backend
  function filterSearch(search: string){
    return function (researcher:any){
      const fullResearcherReference = `${researcher.name} - ${researcher.email}`;
      return (fullResearcherReference.toLowerCase().includes(search.toLowerCase()));
    }
  }

  function filterStatus(status: string){
    return function (researcher:any){
      return (researcher.status === status);
    }
  }

  function filterSearchAndStatus({ search, status }: { search?: string; status?: string }) {
    let result = researchers;
  
    if (status) {
      result = result.filter(filterStatus(status));
    }
  
    if (search) {
      result = result.filter(filterSearch(search));
    }
  
    return result;
  }

  function excludeResearcher(id: string){
    setResearchers(researchers.map((researcher:any) => {
      if(researcher.id == id){
        return { ...researcher, status: "none" };
      }
      else{
        return researcher;
      }
    }))
  }

  function changeRole(id: string, role: string){
    setResearchers(researchers.map((researcher:any) => {
      if(researcher.id == id){
        return { ...researcher, role };
      }
      else{
        return researcher;
      }
    }))
  }

  const [listedResearchers, setListedResearchers] = useState(() => [
    ...filterSearchAndStatus({ status: "pending" }),
    ...filterSearchAndStatus({ status: "expired" }),
    ...filterSearchAndStatus({ status: "included" }),
  ]);

  const [editingResearcherId, setEditingResearcherId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState("");

  function handleSaveRole() {
    if (!editingResearcherId || !editingRole) return;

    changeRole(editingResearcherId, editingRole);

    setEditingResearcherId(null);
    setEditingRole("");
  }

  const handleDelete = () => {
    if (!researcherToDelete) return;

    excludeResearcher(researcherToDelete.id);

    setResearcherToDelete(null);
  }

  useEffect(() => {
    setListedResearchers([
      ...filterSearchAndStatus({ status: "pending" }),
      ...filterSearchAndStatus({ status: "expired" }),
      ...filterSearchAndStatus({ status: "included" }),
    ]);
  }, [researchers]);

  return (
    <>
      {listedResearchers.map((researcher:any) => (
        <Flex key={researcher.id} align="center" gap={5} px={4} py={2} borderWidth="1px" borderColor="gray.200" borderRadius="md">
          <Avatar size="sm" name={researcher.name} bg="#2E4B6C" color="white"/>
          <Flex align={{ base: "flex-start", xl: "center" }} justify="space-between" flex="1" direction={{ base: "column", xl: "row" }} gap={{ base: 2, xl: 0 }}>
            <Text wordBreak="break-word" pr={{ base: 0, xl: 4 }}>{researcher.name} - {researcher.email}</Text>
            <Flex alignItems="center" justifyContent={{ base: "space-between", xl: "flex-end" }} gap={5} w={{ base: "100%", xl: "auto" }}>
              {(researcher.status === "pending" || researcher.status === "expired" || researcher.status === "excluding") && (
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
                        rightIcon={<ChevronDownIcon w={18} h={18}/>}
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
                        {`${t("generalDefinition.input.researchers.role.role")}: ${t(`generalDefinition.input.researchers.role.${editingRole}`)}`}
                      </MenuButton>
                      <MenuList>
                        {AVAILABLE_ROLES.map((role) => (
                          <MenuItem
                            key={role}
                            onClick={() => setEditingRole(role)}
                          >
                            {t(`generalDefinition.input.researchers.role.${role}`)}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  ) : (
                    <Text w={{ base: "auto", xl: "200px" }} h="100%" borderInline="3px solid transparent" p={0} display="flex" alignItems="center" lineHeight="20px">
                      {`${t("generalDefinition.input.researchers.role.role")}: ${t(`generalDefinition.input.researchers.role.${researcher.role}`)}`}
                    </Text>
                  )}
                  <Flex>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if(editingResearcherId === researcher.id) {
                          handleSaveRole();
                        } else {
                          setEditingResearcherId(researcher.id);
                          setEditingRole(researcher.role);
                        }
                      }}
                    >
                      {editingResearcherId === researcher.id ? (
                        <i className="pi pi-save" style={{ color: "black", width: "15px", height: "15px" }}></i>
                      ) : (
                        <Icon as={EditIcon} w="15px" h="15px"/>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setResearcherToDelete(researcher)
                      }
                    >
                      <Icon as={DeleteIcon} w="15px" h="15px"/>
                    </Button>
                  </Flex>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() =>
                    setResearcherToDelete(researcher)
                  }
                >
                  <Icon as={DeleteIcon} w="15px" h="15px"/>
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
              <strong>
                {researcherToDelete?.name}
              </strong>
              ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setResearcherToDelete(null)}
              >
                {t("generalDefinition.input.researchers.confirm.cancel")}
              </Button>

              <Button
                colorScheme="red"
                onClick={handleDelete}
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
