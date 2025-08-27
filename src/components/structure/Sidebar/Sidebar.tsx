import { useContext } from "react";
import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";
import Style from "./Sidebar.module.css";
import CloseButton from "./buttons/CloseButton";
import Navigation from "./Navigation";
import AppContext from "@features/shared/context/ApplicationContext";

interface SidebarProps {
  type: string;
}

const Sidebar = ({ type }: SidebarProps) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { sidebarState, setSidebarState } = context;
  const isOpen = sidebarState === "open";

  const toggleSidebar = () => {
    setSidebarState(isOpen ? "collapsed" : "open");
  };

  return (
    <motion.div
      className={isOpen ? Style.wrapper : Style.collapsed}
      animate={{
        width: isOpen ? "14rem" : "0px", 
        borderRadius: "1.25rem",
      }}
      transition={{ type: "tween", duration: 0.25 }}
    >
      {isOpen ? (
        <>
          <Box className={Style.closeBtn}>
            <CloseButton isOpen={isOpen} handleToggle={toggleSidebar} />
          </Box>
          <Navigation type={type} />
        </>
      ) : (
        <CloseButton
          isOpen={isOpen}
          className={Style.collapsedBtn}
          handleToggle={toggleSidebar}
        />
      )}
    </motion.div>
  );
};

export default Sidebar;