import { Box, Text } from "@chakra-ui/react";
import { Link as ChakraLink } from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { conteiner, text } from "../styles/CardInfosStyle";

interface ICardInfosProps {
  title: string;
  reviewers: string[];
  reviewId: string;
}

export default function CardInfos({ title, reviewers, reviewId }: ICardInfosProps) {
  return (
    <Box sx={conteiner}>
      <ChakraLink as={ReactRouterLink} to={`/newRevision/protocol/${reviewId}`} sx={text}>{title}</ChakraLink>
      <Text>Reviewers: {reviewers} </Text>
    </Box>
  );
}
