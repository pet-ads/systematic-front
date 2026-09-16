import { Button } from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";

type Props = {
  selector?: string;
  fileName?: string;
  onDownloadCsv: () => void;
};

export default function DownloadChartsButton({ onDownloadCsv }: Props) {
  return (
    <Button
      leftIcon={<FiDownload />}
      size="sm"
      colorScheme="blue"
      onClick={onDownloadCsv}
    >
      Download
    </Button>
  );
}
