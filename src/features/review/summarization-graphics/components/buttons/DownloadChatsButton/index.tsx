import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { FiDownload, FiChevronDown } from "react-icons/fi";
import { downloadPNG } from "../../export/ExportPng";
import { useExport } from "@features/review/summarization-graphics/context/ExportContext";

type Props = {
  selector: string;
  fileName: string;
  onDownloadCsv: () => void;
};

export default function DownloadChartsButton({ selector, fileName, onDownloadCsv }: Props) {
  const { startExport, endExport } = useExport();


  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<FiDownload />}
        rightIcon={<FiChevronDown />}
        size="sm"
        colorScheme="blue"
      >
        Download
      </MenuButton>

      <MenuList>
      <MenuItem
  onClick={async () => {
    startExport();
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    await downloadPNG(selector, fileName);
    endExport();
  }}
>
  PNG
</MenuItem>

        <MenuItem onClick={onDownloadCsv}>CSV</MenuItem>
      </MenuList>
    </Menu>
  );
}
