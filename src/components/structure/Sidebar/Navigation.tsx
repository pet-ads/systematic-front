// External library
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { 
  Box, 
  Flex, 
  Accordion, 
  AccordionItem, 
  AccordionButton, 
  AccordionPanel, 
  AccordionIcon, 
  Icon, 
  Text,
  Tooltip
} from "@chakra-ui/react";
import { FiPlusCircle, FiHome, FiUser, FiLogOut } from "react-icons/fi"; 

// Components
import AccordionComponent from "./subComponents/Accordion/AccordionComponent";

// Hooks
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Styles
import Styles from "./Sidebar.module.css";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { toGo } = useNavigation();

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

  const handleLogout = async () => {
    await logout();
    toGo("/");
  };

  return (
    <Flex 
      direction="column" 
      h="calc(100vh - 80px)"
      w="100%" 
      className={Styles.navDiv}
    >
      <Box w="100%" flex="1" overflowY="auto">
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

      <Flex 
        mt="auto"
        direction="row" 
        justifyContent="space-evenly" 
        alignItems="center" 
        pb={6} 
        pt={4}
        w="100%"
        borderTop="1px solid #E2E8F0"
      >
        <Tooltip label="Home" placement="top">
          <Box cursor="pointer" onClick={() => navigate("/home")}>
            <Icon as={FiHome} boxSize="24px" color="#4A4A4A" _hover={{ color: "#3182ce" }} />
          </Box>
        </Tooltip>

        <Tooltip label="Profile" placement="top">
          <Box cursor="pointer" onClick={() => navigate("/profile")}>
            <Icon as={FiUser} boxSize="24px" color="#4A4A4A" _hover={{ color: "#3182ce" }} />
          </Box>
        </Tooltip>

        <Tooltip label="Logout" placement="top">
          <Box cursor="pointer" onClick={handleLogout}>
            <Icon as={FiLogOut} boxSize="24px" color="red.500" _hover={{ color: "red.700" }} />
          </Box>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Navigation;