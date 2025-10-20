import { FormControl,Flex,Heading,Accordion,AccordionItem,AccordionButton,AccordionPanel,Box } from "@chakra-ui/react";
import AddTextTable from "@features/review/planning-protocol/components/common/inputs/text/AddTextTable";

interface ReferenceTableSectionProps {
  title: string;
  placeholder: string;
  defaultOpen?: boolean;
}

export default function ReferenceTableSection({
  title,
  placeholder,
  defaultOpen = true,
}: ReferenceTableSectionProps) {
  return (
    <Accordion defaultIndex={defaultOpen ? [0] : [-1]} allowToggle w="100%">
      <AccordionItem
        border="1px solid #E2E8F0"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
        transition="all 0.2s ease-in-out"
        _hover={{ boxShadow: "md" }}
        bg="white"
      >
        <AccordionButton
          _expanded={{ bg: "#EDF2F7" }}
          borderTopRadius="lg"
          px={6}
          py={4}
        >
          <Box flex="1" textAlign="center">
            <Heading size="md" color="#2E4B6C">
              {title}
            </Heading>
          </Box>
        </AccordionButton>

        <AccordionPanel
          pb={6}
          px={6}
          borderTop="1px solid #E2E8F0"
          borderBottomRadius="lg"
        >
          <Flex direction="column" gap={4}>
            <FormControl>
              <AddTextTable text={title} placeholder={placeholder} />
            </FormControl>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
