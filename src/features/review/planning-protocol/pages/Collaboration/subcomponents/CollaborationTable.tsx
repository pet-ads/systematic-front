import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Flex,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import DefaultTable from "@components/common/tables/DefaultTable";
import { Column } from "@components/common/tables/DefaultTable/types";

export interface CollaboratorRow {
  id: string;
  name: string;
  percentage: number;
  studiesCount: number;
}

interface CollaborationTablesProps {
  mode: string;
}

export default function CollaborationTables({ mode }: CollaborationTablesProps) {
  const { t } = useTranslation("review/planning-protocol");

  const [minReviewers, setMinReviewers] = useState<string>("3");

  const [collaborators, setCollaborators] = useState<CollaboratorRow[]>([
    { id: "1", name: "joao", percentage: 100, studiesCount: 100 },
    { id: "2", name: "gabriel", percentage: 33, studiesCount: 35 },
  ]);

  const handlePercentageChange = (index: number, valueAsNumber: number) => {
    const updated = [...collaborators];
    updated[index].percentage = isNaN(valueAsNumber) ? 0 : valueAsNumber;
    setCollaborators(updated);
  };

  const handleStudiesCountChange = (index: number, valueAsNumber: number) => {
    const updated = [...collaborators];
    updated[index].studiesCount = isNaN(valueAsNumber) ? 0 : valueAsNumber;
    setCollaborators(updated);
  };

  const replicationColumns: Column<CollaboratorRow>[] = [
    {
      key: "name",
      label: t("collaboration.table.collaborator", "colaborador"),
      width: "50%",
      render: (row) => (
        <Text fontSize="sm" color="black" textAlign="center">
          {row.name}
        </Text>
      ),
    },
    {
      key: "percentage",
      label: t("collaboration.table.percentage", "% de estudos"),
      width: "50%",
      render: (row, index) => (
        <Flex justifyContent="center">
          <NumberInput
            size="sm"
            w="100px"
            min={0}
            max={100}
            value={row.percentage}
            onChange={(_, valueAsNumber) => handlePercentageChange(index, valueAsNumber)}
          >
            <NumberInputField textAlign="center" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      ),
    },
  ];

  const divisionColumns: Column<CollaboratorRow>[] = [
    {
      key: "name",
      label: t("collaboration.table.collaborator", "colaborador"),
      width: "50%",
      render: (row) => (
        <Text fontSize="sm" color="black" textAlign="center">
          {row.name}
        </Text>
      ),
    },
    {
      key: "studiesCount",
      label: t("collaboration.table.studiesCount", "número de estudos"),
      width: "50%",
      render: (row, index) => (
        <Flex justifyContent="center">
          <NumberInput
            size="sm"
            w="100px"
            min={0}
            value={row.studiesCount}
            onChange={(_, valueAsNumber) => handleStudiesCountChange(index, valueAsNumber)}
          >
            <NumberInputField textAlign="center" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      ),
    },
  ];
  
  if (mode === "replication") {
    return (
      <Box mt={4}>
        <DefaultTable<CollaboratorRow>
          columns={replicationColumns}
          data={collaborators}
          enableSorting={false}
        />
      </Box>
    );
  }

  if (mode === "division") {
    return (
      <Box mt={4}>
        <Flex
          alignItems="center"
          mb={4}
          border="1px solid #E2E8F0"
          borderRadius="md"
          w="fit-content"
          overflow="hidden"
        >
          <Box px={4} py={2} bg="gray.50" borderRight="1px solid #E2E8F0">
            <Text fontSize="sm" fontWeight="medium">
              {t("collaboration.division.minReviewers", "Mínimo de revisores por estudo")}
            </Text>
          </Box>
          <Select
            value={minReviewers}
            onChange={(e) => setMinReviewers(e.target.value)}
            variant="unstyled"
            size="sm"
            w="70px"
            px={3}
            cursor="pointer"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Select>
        </Flex>

        <DefaultTable<CollaboratorRow>
          columns={divisionColumns}
          data={collaborators}
          enableSorting={false}
        />
      </Box>
    );
  }

  return null;
}