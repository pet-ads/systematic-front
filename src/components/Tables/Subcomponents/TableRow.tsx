import { useDisclosure, Tr, Td, Checkbox } from "@chakra-ui/react";

import ColoredIcon from "../../Icons/ColoredIcon";
import StudiesModal from "./StudiesModal";
import { ModalProvider } from "./ModalContext";

interface IStudy {
  rowData: (string | number)[];
  rowIndex: number;
  isKeyWordTable: boolean;
  getColumnVisibility: (text: string) => boolean;
  headerData: string[];
  title: string;
  status: "Accepted" | "Rejected" | "Unclassified" | "Duplicated";
  readingPriority: "Very high" | "High" | "Low" | "Very low";
  searchSession: "Scopus" | "Web of Science";
  score: number;
  isModalTabel: boolean;
}

export default function TableRow({
  rowData,
  rowIndex,
  isKeyWordTable,
  isModalTabel,
  getColumnVisibility,
  headerData,
}: IStudy) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tr key={rowIndex}>
        {!isKeyWordTable && (
          <Td bgColor={"#9CB0C0"}>
            <Checkbox borderColor={"#2A4F6C"}/>
          </Td>
        )}
        {rowData.map((cell, cellIndex) => (
          <Td
            cursor={"pointer"}
            onClick={onOpen}
            key={cellIndex}
            display={isKeyWordTable ? "" : getColumnVisibility(headerData[cellIndex].toLowerCase()) ? "none" : ""}
            textAlign={"center"}
            bgColor={"#9CB0C0"}
          >
            {cellIndex === 0 && isKeyWordTable ? <ColoredIcon frequency={rowData[2] as number} /> : cell}
          </Td>
        ))}
      </Tr>

      {!isModalTabel &&
        (isOpen ? (
          <ModalProvider>
            <StudiesModal rowData={rowData} isOpen={isOpen} onClose={onClose} />
          </ModalProvider>
        ) : (
          <></>
        ))}
    </>
  );
}
