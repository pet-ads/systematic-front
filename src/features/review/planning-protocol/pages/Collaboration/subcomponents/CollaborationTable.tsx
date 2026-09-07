import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Flex,
  Text,
  Select,
  Checkbox,
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
  type: "principal" | "secundario";
  percentage: number;
  studiesCount: number;
}

interface CollaborationTablesProps {
  mode: string;
}

export default function CollaborationTables({ mode }: CollaborationTablesProps) {
  const { t } = useTranslation("review/planning-protocol");

  const [reviewersPerStudy, setReviewersPerStudy] = useState<number>(1);
  const [dontAssignMultipleSecondary, setDontAssignMultipleSecondary] = useState<boolean>(false);


  //Mock reviewers
  const [collaborators, setCollaborators] = useState<CollaboratorRow[]>([
    { id: "1", name: "joao", type: "principal", percentage: 100, studiesCount: 100 },
    { id: "2", name: "gabriel", type: "secundario", percentage: 33, studiesCount: 35 },
    { id: "3", name: "maria", type: "secundario", percentage: 50, studiesCount: 50 },
    { id: "4", name: "ana", type: "secundario", percentage: 20, studiesCount: 20 },
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

  const handleTypeChange = (index: number, newType: "principal" | "secundario") => {
    const updated = collaborators.map((collab, idx) => {
      if (idx === index) {
        return {
          ...collab,
          type: newType,
          percentage: newType === "principal" ? 100 : collab.percentage,
        };
      }
      if (newType === "principal") {
        return {
          ...collab,
          type: "secundario" as const,
        };
      }
      return collab;
    });
    setCollaborators(updated);
  };

  const secondarySum = collaborators
    .filter((collab) => collab.type === "secundario")
    .reduce((acc, collab) => acc + (Number(collab.percentage) || 0), 0);

  const isCheckboxDisabled = secondarySum > 100;

  const replicationColumns: Column<CollaboratorRow>[] = [
    {
      key: "name",
      label: t("collaboration.table.reviewer", "revisor"),
      width: "35%",
      render: (row) => (
        <Text fontSize="sm" color="black" textAlign="left">
          {row.name}
        </Text>
      ),
    },
    {
      key: "type",
      label: t("collaboration.table.type", "tipo"),
      width: "30%",
      render: (row, index) => (
        <Flex justifyContent="flex-start">
          <Select
            size="sm"
            w="130px"
            value={row.type}
            onChange={(e) =>
              handleTypeChange(index, e.target.value as "principal" | "secundario")
            }
          >
            <option value="principal">{t("collaboration.type.principal", "principal")}</option>
            <option value="secundario">{t("collaboration.type.secundario", "secundário")}</option>
          </Select>
        </Flex>
      ),
    },
    {
      key: "percentage",
      label: t("collaboration.table.percentage", "% de estudos"),
      width: "35%",
      render: (row, index) => (
        <Flex justifyContent="flex-start">
          <NumberInput
            size="sm"
            w="100px"
            min={0}
            max={100}
            value={row.percentage}
            isDisabled={row.type === "principal"}
            onChange={(_, valueAsNumber) => handlePercentageChange(index, valueAsNumber)}
          >
            <NumberInputField textAlign="left" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      ),
    },
  ];

  const totalReviewers = collaborators.length;
  const currentReviewersPerStudy = Math.min(reviewersPerStudy, totalReviewers || 1);
  const calculatedPercentage =
    totalReviewers > 0
      ? ((100 / totalReviewers) * currentReviewersPerStudy).toFixed(1)
      : "0";

  const divisionColumns: Column<CollaboratorRow>[] = [
    {
      key: "name",
      label: t("collaboration.table.reviewer", "revisor"),
      width: "35%",
      render: (row) => (
        <Text fontSize="sm" color="black" textAlign="left">
          {row.name}
        </Text>
      ),
    },
    {
      key: "percentage",
      label: t("collaboration.table.percentage", "% de estudos"),
      width: "30%",
      render: () => (
        <Text fontSize="sm" color="black" fontWeight="medium" textAlign="left">
          {calculatedPercentage}%
        </Text>
      ),
    },
    {
      key: "studiesCount",
      label: t("collaboration.table.studiesCount", "número de estudos"),
      width: "35%",
      render: (row, index) => (
        <Flex justifyContent="flex-start">
          <NumberInput
            size="sm"
            w="100px"
            min={0}
            value={row.studiesCount}
            onChange={(_, valueAsNumber) => handleStudiesCountChange(index, valueAsNumber)}
          >
            <NumberInputField textAlign="left" />
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

        <Flex mt={4} alignItems="center">
          <Checkbox
            isChecked={dontAssignMultipleSecondary && !isCheckboxDisabled}
            isDisabled={isCheckboxDisabled}
            onChange={(e) => setDontAssignMultipleSecondary(e.target.checked)}
            colorScheme="blue"
          >
            <Text fontSize="sm">
              {t(
                "collaboration.replication.dontAssignMultipleSecondary",
                "Não atribuir um mesmo estudo a mais de um revisor secundário"
              )}
            </Text>
          </Checkbox>
        </Flex>
      </Box>
    );
  }

  if (mode === "division") {
    return (
      <Box mt={4}>
        <Flex w="100%" justifyContent="center" mb={4}>
          <Flex
            alignItems="center"
            border="1px solid #E2E8F0"
            borderRadius="md"
            w="fit-content"
            overflow="hidden"
          >
            <Box px={4} py={2} bg="gray.50" borderRight="1px solid #E2E8F0">
              <Text fontSize="sm" fontWeight="medium">
                {t("collaboration.division.reviewersPerStudy", "Revisores por estudo")}
              </Text>
            </Box>
            <Select
              value={currentReviewersPerStudy}
              onChange={(e) => setReviewersPerStudy(Number(e.target.value))}
              variant="unstyled"
              size="sm"
              w="70px"
              px={3}
              cursor="pointer"
            >
              {Array.from({ length: totalReviewers }, (_, i) => i + 1).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </Select>
          </Flex>
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