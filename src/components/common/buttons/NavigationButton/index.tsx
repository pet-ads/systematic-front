import { Button, ButtonProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface iButtonProps extends ButtonProps {
  text: string;
  path?: string;
  variant?: "default" | "dark";
  event?: (() => Promise<void>) | string;
}

const variants = {
  default: {
    bgColor: "#263C56",
    color: "#FFFFFF",
    hoverBgColor: "#C9D9E5",
    hoverColor: "#263C56",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  dark: {
    bgColor: "#FDF0D5",
    color: "#301E1A",
    hoverBgColor: "#301E1A",
    hoverColor: "#FDF0D5",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default function NavButton({
  text,
  path = "",
  variant = "default",
  event = "",
  ...buttonProps
}: iButtonProps) {
  const { bgColor, color, hoverBgColor, hoverColor, borderRadius } =
    variants[variant];

  const handleClick = async () => {
    if (typeof event === "function") {
      await event();
    }
  };

  return (
    <Button 
      as={path ? Link : undefined}
      to={path || undefined}
      ml='2rem'
      onClick={handleClick}
      bgColor={bgColor} 
      color={color}
      borderRadius={borderRadius}
      _hover={{ 
        bgColor: hoverBgColor,
        color: hoverColor,
        boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)" 
      }}
      {...buttonProps}
      transition="all 0.3s ease" 
      outline="none" 
      _focus={{
        boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)", 
      }}
    >
      {text}
    </Button> 
  );
}
