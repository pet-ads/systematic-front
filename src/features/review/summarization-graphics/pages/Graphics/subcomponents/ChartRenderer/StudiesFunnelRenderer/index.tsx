import { Box } from "@chakra-ui/react";
import StudiesFunnelChart from "../../StudiesFunnelChart";
import { fluxogramaBox } from "../../../styles";

type Props = {

  chartId:string;
};

export default function StudiesFunnelRenderer({chartId}: Props) {
      return <Box id={chartId} sx={fluxogramaBox}>
         <StudiesFunnelChart />
       </Box>
}
