// External library
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import { 
  Box, 
  Flex, 
  Accordion, 
  AccordionItem, 
  AccordionButton, 
  AccordionPanel, 
  AccordionIcon, 
  Icon, 
  Text 
} from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";

// Components
import NavItem from "./subComponents/NavItem";
import LogoutButton from "./buttons/LogoutButton";
import AccordionComponent from "./subComponents/Accordion/AccordionComponent";

// Styles
import Styles from "./Sidebar.module.css";

const Navigation = () => {
  const location = useLocation();

  const [openIndex, setOpenIndex] = useState(
    location.pathname.includes("/review") ? 0 : -1
  );

  
  useEffect(() => {
    if (location.pathname.includes("/review")) {
      setOpenIndex(0);
    } else {
      setOpenIndex(-1); 
    }
  }, [location.pathname]);

  return (
    <Flex 
      direction="column" 
      justifyContent="space-between" 
      alignItems="stretch" 
      height="100%" 
      w="100%" 
      className={Styles.navDiv}
    >
      <Box w="100%">
        <NavItem to="/home" text="Home" />
        
        <Accordion 
          allowToggle 
          border="none" 
          mt={0} 
          w="100%"
          index={openIndex} 
          onChange={(index) => setOpenIndex(index as number)}
        >
          <AccordionItem border="none">
            
            <AccordionButton 
              _hover={{ bg: "#f7fafc" }}
              _focus={{ boxShadow: "none", outline: "none" }}
              padding="10px 16px"
              borderLeft="4px solid transparent" 
              display="flex"
              alignItems="center"
              width="100%"
            >
              <Icon as={FiPlusCircle} boxSize="20px" mr="12px" color="#4A4A4A" />
              <Text fontWeight="500" color="#4A4A4A" flex="1" textAlign="left" m="0">
                New Review
              </Text>
              <AccordionIcon color="#4A4A4A" />
            </AccordionButton>

            <AccordionPanel pb={4} px={0} pt={0}>
              <AccordionComponent />
            </AccordionPanel>

          </AccordionItem>
        </Accordion>
      </Box>

      <Box mt="auto" pb={4} w="100%">
        <NavItem to="/profile" text="Profile" />
        <LogoutButton />
      </Box>
    </Flex>
  );
};

export default Navigation;