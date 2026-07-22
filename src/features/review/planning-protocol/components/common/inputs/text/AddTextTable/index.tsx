import { FormControl, FormLabel } from "@chakra-ui/react";
import { useAddText } from "../../../../../services/useAddText";
import { useDeleteText } from "../../../../../hooks/useDeleteText";
import { formcontrol, label } from "./styles";
import InfosTable from "@features/review/planning-protocol/components/common/tables/InfosTable";

interface AddTextTableProps {
  text: string;
  contextId?: string;
  placeholder: string;
  referencePrefix?: string;
  enableReferenceCode?: boolean;
  tableHeight?: string;
}

export default function AddTextTable({
  text,
  contextId,
  placeholder,
  referencePrefix = "",
  enableReferenceCode = true,
  tableHeight,
}: AddTextTableProps) {
  const hookContext = contextId || text;
  const { AddText, handleAddText, setAddText } = useAddText(hookContext);
  const { handleDeleteText } = useDeleteText(hookContext);

  return (
    <FormControl w="100%" sx={label}>
      <FormControl w="100%" sx={formcontrol}>
        <FormLabel mt={"30px"} fontWeight={500} fontSize={"large"}>
          {" "}
          {text}
        </FormLabel>
        <InfosTable
          typeField={""}
          onAddText={(value) => handleAddText(value)}
          onDeleteAddedText={(index) => handleDeleteText(index, setAddText)}
          AddTexts={AddText}
          context={hookContext} 
          placeholder={placeholder}
          referencePrefix={referencePrefix}
          enableReferenceCode={enableReferenceCode}
          maxLength={7}
          tableHeight={tableHeight}
        />
      </FormControl>
    </FormControl>
  );
}