import {
  Flex,
  Text,
  Select,
  FormLabel,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useAgreementVisibility, {
  type AgreementVisibility,
} from "../../services/useAgreementVisibility";
import useToaster from "@components/feedback/Toaster";

export default function AgreementVisibilityControl() {
  const { t } = useTranslation("review/agreement");
  const toast = useToaster();
  const { visibility, canManage, setVisibility, isLoading } =
    useAgreementVisibility();

  if (isLoading) return <Spinner size="sm" />;
  if (!canManage || !visibility) return null;

  async function handleChange(
    stage: "SELECTION" | "EXTRACTION",
    value: AgreementVisibility
  ) {
    try {
      await setVisibility(stage, value);
      toast({
        title: t("visibility.toast.successTitle"),
        status: "success",
      });
    } catch {
      toast({
        title: t("visibility.toast.errorTitle"),
        description: t("visibility.toast.errorDesc"),
        status: "error",
      });
    }
  }

  const fieldStyle = {
    bg: "white",
    border: "1px solid",
    borderColor: "gray.300",
    borderRadius: "md",
    fontSize: "sm",
    color: "#2E4B6C",
    _focus: { borderColor: "#2E4B6C", boxShadow: "0 0 0 1px #2E4B6C" },
  };

  const labelStyle = {
    fontSize: "xs" as const,
    fontWeight: "bold",
    color: "gray.600",
    mb: 1,
  };

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      bg="gray.50"
      mb={4}
    >
      <Text fontWeight="bold" fontSize="sm" color="#2E4B6C" mb={3}>
        {t("visibility.title")}
      </Text>

      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        {/* Visibilidade de Selection */}
        <Flex direction="column" flex={1}>
          <FormLabel {...labelStyle}>{t("visibility.selection")}</FormLabel>
          <Select
            {...fieldStyle}
            value={visibility.selection}
            onChange={(e) =>
              handleChange("SELECTION", e.target.value as AgreementVisibility)
            }
          >
            <option value="ALL">{t("visibility.options.all")}</option>
            <option value="FINISHED_ONLY">
              {t("visibility.options.finishedOnly")}
            </option>
            <option value="NONE">{t("visibility.options.none")}</option>
          </Select>
        </Flex>

        {/* Visibilidade de Extraction */}
        <Flex direction="column" flex={1}>
          <FormLabel {...labelStyle}>{t("visibility.extraction")}</FormLabel>
          <Select
            {...fieldStyle}
            value={visibility.extraction}
            onChange={(e) =>
              handleChange("EXTRACTION", e.target.value as AgreementVisibility)
            }
          >
            <option value="ALL">{t("visibility.options.all")}</option>
            <option value="FINISHED_ONLY">
              {t("visibility.options.finishedOnly")}
            </option>
            <option value="NONE">{t("visibility.options.none")}</option>
          </Select>
        </Flex>
      </Flex>
    </Box>
  );
}