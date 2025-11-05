import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { FiDownload, FiChevronDown } from "react-icons/fi";
import { downloadPNG } from "../../export/ExportPng";
//import { downloadCSV } from "../../export/ExportCsv";

type Props = {
  selector: string;
  fileName: string;
};

export default function DownloadChartsButton({ selector, fileName }: Props) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<FiDownload />}
        rightIcon={<FiChevronDown />}
        colorScheme="blue"
        size="sm"
      >
        Download
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => downloadPNG(selector, fileName)}>PNG</MenuItem>
      </MenuList>
    </Menu>
  );
}
