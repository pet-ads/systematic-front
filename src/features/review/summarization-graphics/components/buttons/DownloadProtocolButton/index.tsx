import { Menu, MenuButton, MenuList, MenuItem, Button, Box } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { DownloadProtocolFormat, useDownloadProtocol } from "@features/review/summarization-graphics/services/useDownloadProtocol";

export const DownloadProtocolMenu = () => {
  const { downloadProtocol, isLoading, error } = useDownloadProtocol();

  const handleDownload = (format: DownloadProtocolFormat) => {
    downloadProtocol(format);
  };
  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          colorScheme="blue"
          rightIcon={<ChevronDownIcon />}
          isLoading={isLoading} 
        >
          Download Protocol
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleDownload("latex")}>LaTeX</MenuItem>
        </MenuList>
      </Menu>

      {error && (
        <Box mt={2} color="red.500">
          {error}
        </Box>
      )}
    </Box>
  );
};
