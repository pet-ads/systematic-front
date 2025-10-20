import { useState } from "react";
import { FormControl, FormLabel, Input, Flex } from "@chakra-ui/react";
import { useAddText } from "../../../../../services/useAddText";
import { useDeleteText } from "../../../../../hooks/useDeleteText";
import { formcontrol, label } from "./styles";
import InfosTable from "@features/review/planning-protocol/components/common/tables/InfosTable";

interface AddTextTableProps {
  text: string;
  placeholder: string;
  referencePrefix?: string;
}

export default function AddTextTable({
  text,
  placeholder,
  referencePrefix = "",
}: AddTextTableProps) {
  const { AddText, handleAddText, setAddText } = useAddText(text);
  const { handleDeleteText } = useDeleteText(text);
  const [referenceCode, setReferenceCode] = useState("");
  const [usedCodes, setUsedCodes] = useState<string[]>([]);

  const generateNextCode = () => {
    const nextNumber = usedCodes.length + 1;
    return `${referencePrefix}-${String(nextNumber).padStart(2, "0")}`;
  };

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().trim();
    setReferenceCode(value);
  };

  const handleAddWithReference = (value: string) => {
    const code = referenceCode || generateNextCode();

    if (usedCodes.includes(code)) {
      alert("Esse código de referência já está em uso!");
      return;
    }

    const entry = `${code}: ${value}`;
    handleAddText(entry);
    setUsedCodes((prev) => [...prev, code]);
    setReferenceCode("");
  };

  return (
    <FormControl sx={label}>
      <FormControl sx={formcontrol}>
        <Flex align="center" justify="start" mb={1}>
          <FormLabel m={2}>{text}</FormLabel>
          <Input
            value={referenceCode}
            onChange={handleReferenceChange}
            placeholder={`${referencePrefix}-01`}
            size="sm"
            w="110px"
            textAlign="left"
          />
        </Flex>
        <InfosTable
          typeField=""
          onAddText={handleAddWithReference}
          onDeleteAddedText={(index) => handleDeleteText(index, setAddText)}
          AddTexts={AddText}
          context={text}
          placeholder={placeholder}
        />
      </FormControl>
    </FormControl>
  );
}
