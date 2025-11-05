// External library
import { Box, Tooltip } from "@chakra-ui/react";
import { Link } from "react-router-dom";

// Styles
import Styles from "./AccordionNavItem.module.css";

// Types
interface Props {
  to: string;
  text: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Hooks
import useActiveSection from "@features/shared/hooks/useActiveSection";

const ProtocolAccordionSubItem = ({
  to,
  text,
  icon,
  disabled = false,
}: Props) => {
  const { pathname } = useActiveSection();
  const isActive = pathname === to;

  const linkStyles = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    textDecoration: "none",
    color: isActive ? "black" : "#272927",
    fontWeight: isActive ? "bold" : "normal",
    flex: 1,
    opacity: disabled ? 0.45 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  if (disabled) {
    return (
      <Tooltip
        label="Defina sua Review primeiro"
        placement="right"
      >
        <Box
          w="100%"
          display="flex"
          alignItems="center"
          className={Styles.accordionNavlinkBox}
          gap=".75rem"
          bg="transparent"
          borderRadius=".25rem"
          opacity={0.6}
          cursor="not-allowed"
        >
          {icon}
          <Box style={linkStyles}>
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "100%",
                minHeight: "1rem",
                borderLeft: "none",
              }}
            />
            {text}
          </Box>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box
      w="100%"
      display="flex"
      alignItems="center"
      className={Styles.accordionNavlinkBox}
      gap=".75rem"
      bg={isActive ? "#dadada" : "transparent"}
      borderRadius=".25rem"
    >
      {icon}
      <Link className={Styles.accordionLink} to={to} style={linkStyles}>
        <span
          style={{
            display: "inline-block",
            width: "6px",
            height: "100%",
            minHeight: "1rem",
            borderLeft: isActive ? "2px solid black" : "none",
          }}
        />
        {text}
      </Link>
    </Box>
  );
};

export default ProtocolAccordionSubItem;
