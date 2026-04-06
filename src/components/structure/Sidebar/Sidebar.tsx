// External library
import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box } from "@chakra-ui/react";

// Context
import AppContext from "@features/shared/context/ApplicationContext";

// Components
import CloseButton from "./buttons/CloseButton";
import Navigation from "./Navigation";

// Styles
import Style from "./Sidebar.module.css";

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
      className={Style.wrapper}
      animate={{
        width: isOpen ? "14rem" : "3rem",
        borderRadius: "1.25rem",
        backgroundColor: isOpen ? "#fff" : "#ffffff00",
      }}
      transition={{ type: "tween", duration: 0.5 }}
    >
      <Box className={isOpen ? Style.closeBtn : Style.collapsedBtn}>
        <CloseButton isOpen={isOpen} handleToggle={toggleSidebar} />
      </Box>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{
              pointerEvents: isOpen ? "auto" : "none",
            }}
            className={Style.contentWrapper}
          >
            <Navigation type={type} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;
