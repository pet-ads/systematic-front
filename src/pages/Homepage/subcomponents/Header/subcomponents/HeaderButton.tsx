import { Button } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { buttonTheme } from "./styles/ButtonTheme";
import AppContext from "../../../../../components/Context/AppContext";

interface IHeaderButton {
  text: string;
  type: string;
}

export default function HeaderButton({ text, type }: IHeaderButton) {
  const location = useLocation();
  const context = useContext(AppContext);
  const isActive = context?.activeButton === type && location.pathname === "/landing";

  function handleClick() {
    if (context) {
      context.setRenderForm(type);
      context.setActiveButton(type);
    }
  }

  return (
    <Button
      color={isActive ? "black" : "white"}
      bgColor={isActive ? "white" : "rgba(0,0,0,0)"}
      sx={buttonTheme}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
}
