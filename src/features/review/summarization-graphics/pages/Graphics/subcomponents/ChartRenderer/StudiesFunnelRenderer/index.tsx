import { Box } from "@chakra-ui/react";
import StudiesFunnelChart from "../../StudiesFunnelChart";
import { fluxogramaBox } from "../../../styles";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";

type Props = {
  filteredStudies: (ArticleInterface | StudyInterface)[];
  chartId: string;
};

export default function StudiesFunnelRenderer({ filteredStudies, chartId }: Props) {
      return <Box id={chartId} sx={fluxogramaBox}>
         <StudiesFunnelChart filteredStudies={filteredStudies} />
       </Box>
}
