import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, FormLabel, Input, Textarea, Box, IconButton, Flex, Divider } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import UseDeleteSession from "../../../hooks/reviews/useDeleteSession";
import {useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { useToast } from "@chakra-ui/react";

interface DeleteDatabaseModalProps {
    show: (value: boolean) => void;
    action: "delete" | "refuse";
    sessions:  {
        id: string, 
        systematicStudyd: string, 
        userId: string,    
        searchString: string, 
        additionalInfo: string, 
        timestamp: string, 
        source: string, 
        numberOfRelatedStudies: number
    }[];
    databaseName: string;
    onDeleteAll: () => void;
}

function DeleteDatabaseModal({ show, sessions, databaseName, onDeleteAll}: DeleteDatabaseModalProps) {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [nameOfDatabase, setNameOfDatabase] = useState<string>("");
    const toast = useToast();

    useEffect(() => {
        onOpen();
    }, []);

    function close() {
        show(false);
        onClose();
    }

    const isDatabaseNameCorrect = (name: string) => {
        return nameOfDatabase.trim() !== name.trim();
    }

    const deleteAllReferences = async () => {
        if (isDatabaseNameCorrect(nameOfDatabase)) {
            toast({
                title: "Invalid Database Name",
                description: "Please enter the correct database name to proceed.",
                status: "error",
                duration: 4500,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            sessions.map(async (study) => {
                await UseDeleteSession(study.id);
            });

            toast({
                title: "All Study Sessions Deleted!",
                description: "Your study sessions have been successfully removed.",
                status: "success",
                duration: 4500,
                isClosable: true,
                position: "top",
              });
              close();
              onDeleteAll();    
        } catch (err) {
            console.log(err);
            toast({
                title: "Action Failed",
                description: "Please ensure the field is filled before proceeding.",
                status: "error",
                duration: 4500,
                isClosable: true,
                position: "top",
              });
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color={"#263C56"}>
                    <FormControl mt={3} display="flex" mb={4} gap={3} justifyContent="left" alignItems="center">
                        <Flex gap={3}>
                        <IoIosWarning size="2rem"/>
                        <FormLabel fontWeight="bold" fontSize="larger">Delete all session studies</FormLabel>
                        </Flex>
                    </FormControl>
                    <ModalCloseButton onClick={close} />
                </ModalHeader>
                <ModalBody>
                    <Flex>
                     Are you sure you want to delete all references in database? This action is permanent and cannot be undone.
                    </Flex>
                    <FormControl mt={4} mb={3}>
                        <FormLabel>
                            To delete data from "{databaseName}", write the database name below:
                        </FormLabel>
                        <Input
                            onChange={(e) => setNameOfDatabase(e.target.value)}
                            value={nameOfDatabase}
                            placeholder="Enter database name"
                            aria-label="Database name input"
                        />
                    </FormControl>
                </ModalBody>
                <Divider colorScheme="purple.400"/>
                <ModalFooter mt={3}>
                    <Flex alignItems="center" justifyContent="space-evenly" gap={2}>
                    <Button onClick={close}
                        backgroundColor={"#263C56"}
                        color={"#EBF0F3"}
                        boxShadow="sm"
                        _hover={{ bg: "#2A4A6D", boxShadow: "md" }}
                    >
                       Cancel</Button>
                       <Button
                            onClick={deleteAllReferences}
                            backgroundColor={"#263C56"}
                            color={"#EBF0F3"}
                            boxShadow="sm"
                            _hover={{ bg: "#2A4A6D", boxShadow: "md" }}
                            isDisabled={isDatabaseNameCorrect(databaseName)}
                        >
                            Remove
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DeleteDatabaseModal