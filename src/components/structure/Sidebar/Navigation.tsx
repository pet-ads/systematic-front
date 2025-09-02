import NavItem from "./subComponents/NavItem";
import { Box, Flex } from "@chakra-ui/react";
import AccordionComponent from "./subComponents/Accordion/AccordionComponent";
import Styles from "./Sidebar.module.css";
import LogoutButton from "./buttons/LogoutButton";

interface Props {
  type: string;
}

const Navigation = ({ type }: Props) => {
  //const id = localStorage.getItem('systematicReviewId');

  return type == "Default" ? (
    <Flex direction="column" justifyContent="space-between" height="100%">
      <Box className={Styles.navDiv}>
        <NavItem
          to="/review/planning/protocol/general-definition"
          text="New Review"
        />
        <NavItem to="/my-reviews" text="My Reviews" />
        <NavItem to="/profile" text="Profile" />
        <LogoutButton />
      </Box>
    </Flex>
  ) : (
    <Box className={Styles.accordionNavDiv}>
      <AccordionComponent />
      <Box mt="2.6vw">
        <NavItem to="/my-reviews" text="My Reviews" />
        <NavItem to="/profile" text="Profile" />
        <LogoutButton />
      </Box>
    </Box>
  );
};

export default Navigation;
