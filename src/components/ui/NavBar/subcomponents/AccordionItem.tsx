import NavItem from "./NavItem";
import { useContext } from "react";
import { Link } from "react-router-dom";
import SidebarContext from "../../../Context/AppContext";
import { AccordionButton, Icon, AccordionIcon, Box, AccordionItem, AccordionPanel } from "@chakra-ui/react";
import { iconbox } from "../styles/AccordionItenStyles";

interface IAccordionElementProps {
  navSize: string;
  icon?: React.ElementType;
  title: string;
  names: string[];
  basePath: string;
}

export default function AccordionElement({ navSize, icon, title, names, basePath }: IAccordionElementProps) {
  const isSmallSize = navSize === "small";
  const shouldRenderIcon = isSmallSize || (
    <Box sx={iconbox}>
      <Icon as={icon} /> {title}
    </Box>
  );
  const context = useContext(SidebarContext);
  if (!context) {
    return <>Problema com useContext em NavItem.tsx</>;
  }

  const { item, setItem, button } = context;
  function isSelected(): boolean {
    const Planning: string[] = ["Protocol"];
    const Execution: string[] = ["KeyWords", "Insertion", "Identification", "Selection", "Extraction"];
    const Summarization: string[] = ["Graphics", "Visualization", "Finalization"];
    if (Planning.includes(button)) setItem("Planning");
    else if (Execution.includes(button)) setItem("Execution");
    else if (Summarization.includes(button)) setItem("Summarization");
    return item == title;
  }

  return (
    <AccordionItem alignContent={isSmallSize ? "center" : "flex-start"}>
      <AccordionButton bg={isSelected() ? "black" : "white"} color={isSelected() ? "white" : "black"}>
        {isSmallSize && <Icon as={icon} />}
        {shouldRenderIcon}
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        {names.map((name) => (
          <Link to={`${basePath}/${name.toLowerCase()}`} key={name}>
            <NavItem title={name} navSize={navSize} />
          </Link>
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
}
