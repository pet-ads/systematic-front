import { Button, Flex, IconButton } from "@chakra-ui/react";
import { boxconteiner, buttonconteiner, conteiner } from "../../../styles/BtnSelectionStyles";
import ComboBox from "../../../../../components/Inputs/ComboBox";
import useInputState from "../../../../../hooks/useInputState";
import { FaPen } from "react-icons/fa6";
import { useContext } from "react";
import AppContext from "../../../../../components/Context/AppContext";
import { StudyInterface } from "../../../../../../public/interfaces/IStudy";

export default function ButtonsForSelection() {
  const context = useContext(AppContext);
  const sortedStudies = context?.sortedStudies;
  console.log(sortedStudies);
  const index = context?.sortedSelectionStudyIndex;
  console.log(index);

  function ChangeToNext() {
    const newIndex = (index as number) + 1;
    context?.setSortedSelectionStudyIndex(newIndex)
    context?.setSelectionStudy((sortedStudies as StudyInterface[])[newIndex])
  }

  function ChangeToPrevius() {
    const newIndex = (index as number) - 1;
    context?.setSortedSelectionStudyIndex(newIndex)
    context?.setSelectionStudy((sortedStudies as StudyInterface[])[newIndex])
  }
  const criteriosExclusao: string[] = [
    "Tipo estudo inadequado",
    "Idioma não compreendido",
    "Data publicação fora período",
    "Publicação não revisada",
    "População não incluída",
    "Intervenção diferente",
    "Comparador inadequado",
    "Desfechos não medidos",
    "Baixa qualidade metodológica",
    "Dados incompletos/indisponíveis",
  ];

  // Critérios de Inclusão (Inclusion Criteria)
  const criteriosInclusao: string[] = [
    "Tipo estudo adequado",
    "Idioma compreendido",
    "Data publicação dentro período",
    "Publicação revisada",
    "População incluída",
    "Intervenção igual",
    "Comparador adequado",
    "Desfechos medidos",
    "Alta qualidade metodológica",
    "Dados completos/disponíveis",
  ];
  const { handleChange: handleCheckboxChange } = useInputState<string[]>([]);

  return (
    <>
      <Flex sx={conteiner}>
      <Flex direction={"row"} p="2">
        <IconButton aria-label="Edit Study Data" w="28px" h="28px" icon={<FaPen />} />
      </Flex>

        <Flex sx={boxconteiner}>
          
          <ComboBox
            text="filter options"
            options={criteriosExclusao}
            handleCheckboxChange={handleCheckboxChange}
            selectedItems={criteriosExclusao}
          />
          <ComboBox
            text="filter options"
            options={criteriosInclusao}
            handleCheckboxChange={handleCheckboxChange}
            selectedItems={criteriosInclusao}
          />
        </Flex>

        <Flex sx={buttonconteiner}>
          <Button borderRadius={"3px"} onClick={ChangeToPrevius}>Previous</Button>
          <Button borderRadius={"3px"} onClick={ChangeToNext}>Next</Button>
        </Flex>

        <Button borderRadius={"3px"}>Redifine</Button>
      </Flex>
    </>
  );
}
