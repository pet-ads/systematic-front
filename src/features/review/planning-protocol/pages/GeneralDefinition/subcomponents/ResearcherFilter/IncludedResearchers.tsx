import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Icon, Text, Avatar, Button } from "@chakra-ui/react";
import { researchersMock } from "../../../../../../../mocks/researchers";
import { useState, useEffect } from "react";

export default function IncludedResearchers() {
  const [addedResearchers, setAddedResearchers] = useState(researchersMock.filter((researcher) => researcher.status !== "none"));

  useEffect(() => {
    // simulating API call to get added researchers
    setAddedResearchers(researchersMock.filter((researcher) => researcher.status !== "none"));
  }, []);

  const handleDelete = (id: string, name: string, email: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name} (${email})?`,
    );
    if (!confirmed) return;

    setAddedResearchers(
      addedResearchers.map((researcher) =>
        researcher.id === id
          ? { ...researcher, status: "excluding" }
          : researcher,
      ),
    );
  };

  return (
    <>
    {addedResearchers.map((researcher) => (
      <Flex align="center" gap={5} px={4} py={2} borderWidth="1px" borderColor="gray.200" borderRadius="md">
        <Avatar size="sm" name={researcher.name} />
        <Flex align="center" justify="space-between" flex="1">
          <Text>{researcher.name} - {researcher.email}</Text>
          <Flex align="center" gap={5}>
            {(researcher.status === "pending" || researcher.status === "expired" || researcher.status === "excluding") && (
              <Text color="gray.500">
                {researcher.status.charAt(0).toUpperCase() + researcher.status.slice(1)}
              </Text>
            )}
            {researcher.status == "included" && (<Text>Role: {researcher.role}</Text>)}
            <Button
              variant="ghost"
              onClick={() =>
                handleDelete(researcher.id, researcher.name, researcher.email)
              }
            >
              <Icon as={DeleteIcon} w={"15px"} h={"15px"} />
            </Button>
          </Flex> 
        </Flex>
      </Flex>
    ))}
    </>
  );
}
