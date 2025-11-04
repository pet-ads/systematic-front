// External Library
import React from "react";
import { Box, FormControl, FormControlProps } from "@chakra-ui/react";

// Components
import FlexLayout from "@components/structure/Flex/Flex";
import Header from "@components/structure/Header/Header";
import CardDefault from "@components/common/cards";

// Types
interface ProtocolFormLayoutProps {
  headerText: string;
  children: React.ReactNode;
  navButtons: React.ReactNode;
  formControlProps?: FormControlProps;
}

export default function ProtocolFormLayout({
  headerText,
  children,
  navButtons,
  formControlProps = {},
}: ProtocolFormLayoutProps) {
  const baseFormControlStyles = {
    m: "30px auto 0",
    display: "flex",
    gap: 10,
    flexDir: "column" as const,
    alignItems: "center", 
    flexGrow: 1,
    w: "100%",
  };

  const maxContentWidth = "55rem";

  return (
    <FlexLayout navigationType="Accordion">
      <Header text={headerText} />
      <CardDefault
        backgroundColor="#fff"
        borderRadius="1rem"
        withShadow={false}
      >
        <Box
          display="flex"
          flexDirection="column"
          h="100%" 
          w="100%"
        >
          <Box
            flexGrow={1}
            overflowY="auto" 
            overflowX="hidden"
            w="100%"
            display="flex"
            flexDirection="column"
            alignItems={"center"}
          >
            <Box
                mx="auto"
                w="100%"
            >
                <FormControl
                    {...baseFormControlStyles}
                    {...formControlProps}
                    minW={0}
                    gap="2rem"
                >
                    {children}
                </FormControl>
            </Box>
          </Box>
          <Box
            flexShrink={0} 
            w="100%"
            pt={"0.69rem"}
            mb={4}
          >
            <Box
                maxW={maxContentWidth}
                mx="auto"
                w="60vw"
                display={"flex"}
                alignItems={"center"}
                justifyContent={"end"}
            >
                {navButtons}
            </Box>
          </Box>
        </Box>
      </CardDefault>
    </FlexLayout>
  );
}
