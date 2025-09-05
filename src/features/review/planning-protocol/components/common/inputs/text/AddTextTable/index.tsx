import { FormControl } from "@chakra-ui/react";
import AddTextField from "../AddTextField";

import { useAddText } from "../../../../../services/useAddText";
import { useDeleteText } from "../../../../../hooks/useDeleteText";
import { formcontrol, label } from "./styles";
import InfosTable from "@features/review/planning-protocol/pages/StepThree/subcomponents/tables/InfosTable";

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
        <AddTextField
          onAddText={handleAddText}
          label={text}
          text={placeholder}
        />
        <InfosTable
          typeField={""}
          onAddText={handleAddText}
          onDeleteAddedText={(index) => handleDeleteText(index, setAddText)}
          AddTexts={AddText}
          context={text}
        />
      </FormControl>
    </FormControl>
  );
}
