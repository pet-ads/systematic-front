import { Icon } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Styles from "./NavItem.module.css";
import { ImExit, ImBooks } from "react-icons/im";
import { FiPlusCircle } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

interface Props {
  to: string;
  text: string;
}

const NavItem = ({ to, text }: Props) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${Styles.linksBox} ${Styles.active}` : Styles.linksBox
      }
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px", 
        textDecoration: "none",
        boxSizing: "border-box"
      }}
    >
      
      {to === "/home" && (
        <Icon boxSize="20px" mr="12px" as={ImBooks} color="inherit" />
      )}
      {to === "/review/planning/protocol/general-definition" && (
        <Icon boxSize="20px" mr="12px" as={FiPlusCircle} color="inherit" />
      )}
      {to === "/profile" && (
        <Icon boxSize="20px" mr="12px" as={CgProfile} color="inherit" />
      )}
      {to === "/" && (
        <Icon boxSize="20px" mr="12px" as={ImExit} color="inherit" />
      )}
      
      <span>{text}</span>
    </NavLink>
  );
};

export default NavItem;