import { Heading } from "@chakra-ui/react";
import { header } from "./headerStyles";

interface IHeaderProps {
  text: string;
}

export default function Header({ text }: IHeaderProps) {
  return <Heading sx={header} ml={"2.25rem"}>{text}</Heading>;
}
