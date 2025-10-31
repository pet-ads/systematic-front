import { FormControl, FormLabel } from "@chakra-ui/react";
import { useAddText } from "../../../../../services/useAddText";
import { useDeleteText } from "../../../../../hooks/useDeleteText";
import { formcontrol, label } from "./styles";
import InfosTable from "@features/review/planning-protocol/components/common/tables/InfosTable";

interface AddTextTableProps {
  text: string;
  placeholder: string;
}

export default function AddTextTable({ text, placeholder }: AddTextTableProps) {
  const { AddText, handleAddText, setAddText } = useAddText(text);
  const { handleDeleteText } = useDeleteText(text);
  return (
    <FormControl sx={label}>
      <FormControl sx={formcontrol}>
        <FormLabel fontWeight={500} fontSize={"large"}>{text}</FormLabel>
        <InfosTable
          typeField={""}
          onAddText={handleAddText}
          onDeleteAddedText={(index) => handleDeleteText(index, setAddText)}
          AddTexts={AddText}
          context={text}
          placeholder={placeholder}
        />
      </FormControl>
    </FormControl>
  );
}
