import { FormControl, FormLabel } from "@chakra-ui/react";
import { useAddText } from "../../../../../services/useAddText";
import { useDeleteText } from "../../../../../hooks/useDeleteText";
import { formcontrol, label } from "./styles";
import InfosTable from "@features/review/planning-protocol/components/common/tables/InfosTable";

interface AddTextTableProps {
  text: string;
  placeholder: string;
  referencePrefix?: string;
}

export default function AddTextTable({ text, placeholder, referencePrefix = ""}: AddTextTableProps) {
  const { AddText, handleAddText, setAddText } = useAddText(text);
  const { handleDeleteText } = useDeleteText(text);
  return (
    <FormControl sx={label}>
      <FormControl sx={formcontrol}>
        <FormLabel mt={"30px"} fontWeight={500} fontSize={"large"}>{text}</FormLabel>
        <InfosTable
          typeField={""}
          onAddText={(value) => handleAddText(value)}
          onDeleteAddedText={(index) => handleDeleteText(index, setAddText)}
          AddTexts={AddText}
          context={text}
          placeholder={placeholder}
          referencePrefix={referencePrefix}
        />
      </FormControl>
    </FormControl>
  );
}
