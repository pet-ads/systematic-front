import { Box, Checkbox, Heading, Stack, Text } from "@chakra-ui/react";
import { ConductionExportConfig } from "../../services/exportReviewTypes";
import { useTranslation } from "react-i18next";

type Props = {
  config: ConductionExportConfig;
  onChange: (config: ConductionExportConfig) => void;
};

export default function ConductionExportSection({ config, onChange }: Props) {
  const toggle = (key: keyof ConductionExportConfig) =>
    onChange({ ...config, [key]: !config[key] });
  const { t } = useTranslation("review/summarization-download");

  return (
    <Box>
      <Heading size="md" mb={3}>{t("conduction.title")}</Heading>
      <Stack spacing={2}>
        <Checkbox isChecked={config.includedInFirstSelection} onChange={() => toggle("includedInFirstSelection")}>
          {t("conduction.includedInFirstSelection")}
        </Checkbox>
        <Checkbox isChecked={config.excludedInFirstSelection} onChange={() => toggle("excludedInFirstSelection")}>
          {t("conduction.excludedInFirstSelection")}
        </Checkbox>
        <Checkbox isChecked={config.includedInSecondSelection} onChange={() => toggle("includedInSecondSelection")}>
          {t("conduction.includedInSecondSelection")}
        </Checkbox>
        <Checkbox isChecked={config.excludedInSecondSelection} onChange={() => toggle("excludedInSecondSelection")}>
          {t("conduction.excludedInSecondSelection")}
        </Checkbox>
        <Checkbox isChecked={config.consolidatedExtraction} onChange={() => toggle("consolidatedExtraction")}>
          {t("conduction.consolidatedExtraction")}
        </Checkbox>
        <Checkbox isChecked={config.funnel} onChange={() => toggle("funnel")}>
          {t("conduction.funnel")}
        </Checkbox>
      </Stack>
      <Text fontSize="sm" color="gray.500" mt={2}>
        {t("conduction.conductionDescription")}
      </Text>
    </Box>
  );
}