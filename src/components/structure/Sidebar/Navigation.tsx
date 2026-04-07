// External library
import { useNavigate } from "react-router-dom";
import { Box, Flex, Icon, Tooltip } from "@chakra-ui/react";
// Adicionei o FiPlusCircle para manter o mesmo padrão de ícones da linha de baixo
import { FiHome, FiUser, FiLogOut, FiPlusCircle } from "react-icons/fi";

// Components
import AccordionComponent from "./subComponents/Accordion/AccordionComponent";

// Hooks
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Styles
import Styles from "./Sidebar.module.css";

// Types
interface Props {
  type: string;
}

const Navigation = ({ type }: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { toGo } = useNavigation();

  const handleLogout = async () => {
    await logout();
    toGo("/");
  };

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      height="calc(100vh - 80px)"
    >
      <Box flex="1" overflowY="auto">
        {type === "Default" ? (
          <Box className={Styles.accordionNavDiv}>
            <Flex
              onClick={() =>
                navigate("/review/planning/protocol/general-definition")
              }
              cursor="pointer"
              w="80%"
              p=".5rem"
              alignItems="center"
              gap=".5rem"
              borderRadius=".25rem"
              color="black"
              fontWeight="light"
              _hover={{ bg: "#eeeeee" }}
            >
              <Icon as={FiPlusCircle} boxSize="1.25rem" />
              <Box as="span" fontSize="1rem">
                New Review
              </Box>
            </Flex>
          </Box>
        ) : (
          <Box className={Styles.accordionNavDiv}>
            <AccordionComponent />
          </Box>
        )}
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
            <Icon
              as={FiHome}
              boxSize="24px"
              color="#4A4A4A"
              _hover={{ color: "#3182ce" }}
            />
          </Box>
        </Tooltip>

        <Tooltip label="Profile" placement="top">
          <Box cursor="pointer" onClick={() => navigate("/profile")}>
            <Icon
              as={FiUser}
              boxSize="24px"
              color="#4A4A4A"
              _hover={{ color: "#3182ce" }}
            />
          </Box>
        </Tooltip>

        <Tooltip label="Logout" placement="top">
          <Box cursor="pointer" onClick={handleLogout}>
            <Icon
              as={FiLogOut}
              boxSize="24px"
              color="red.500"
              _hover={{ color: "red.700" }}
            />
          </Box>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Navigation;