import { Box, Checkbox, Heading, Stack, Text } from "@chakra-ui/react";
import { ConductionExportConfig } from "../../services/exportReviewTypes";

type Props = {
  config: ConductionExportConfig;
  onChange: (config: ConductionExportConfig) => void;
};

export default function ConductionExportSection({ config, onChange }: Props) {
  const toggle = (key: keyof ConductionExportConfig) =>
    onChange({ ...config, [key]: !config[key] });

  return (
    <Box>
      <Heading size="md" mb={3}>Condução</Heading>
      <Stack spacing={2}>
        <Checkbox isChecked={config.includedInFirstSelection} onChange={() => toggle("includedInFirstSelection")}>
          Estudos incluídos na primeira seleção (por critério)
        </Checkbox>
        <Checkbox isChecked={config.excludedInFirstSelection} onChange={() => toggle("excludedInFirstSelection")}>
          Estudos excluídos na primeira seleção (por critério)
        </Checkbox>
        <Checkbox isChecked={config.includedInSecondSelection} onChange={() => toggle("includedInSecondSelection")}>
          Estudos incluídos na segunda seleção (por critério)
        </Checkbox>
        <Checkbox isChecked={config.excludedInSecondSelection} onChange={() => toggle("excludedInSecondSelection")}>
          Estudos excluídos na segunda seleção (por critério)
        </Checkbox>
        <Checkbox isChecked={config.consolidatedExtraction} onChange={() => toggle("consolidatedExtraction")}>
          Estudos considerados na extração (consolidado)
        </Checkbox>
        <Checkbox isChecked={config.funnel} onChange={() => toggle("funnel")}>
          Funil de estudos
        </Checkbox>
      </Stack>
      <Text fontSize="sm" color="gray.500" mt={2}>
        As quatro primeiras opções geram tabelas com os IDs de todos os estudos — úteis para relatório técnico.
      </Text>
    </Box>
  );
}