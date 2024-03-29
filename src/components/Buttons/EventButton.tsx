import { Button, ButtonProps } from "@chakra-ui/react";

interface IEventButtonProps extends ButtonProps {
  event: () => void;
  text: string;
}

export default function EventButton({ event, text, ...buttonProps }: IEventButtonProps) {
  const handleClick = () => {
    event();
  };

  return (
    <Button onClick={handleClick} {...buttonProps}>
      {text}
    </Button>
  );
}
