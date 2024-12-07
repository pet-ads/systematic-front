import React from 'react'
import { Box, Icon, createIcon } from '@chakra-ui/react';
import { Link } from 'react-router-dom'
import { PlusSquareIcon } from '@chakra-ui/icons';
import Styles from './NavItem.module.css';
import { ImExit } from "react-icons/im";
import { FiPlusCircle } from "react-icons/fi";
import { ImBooks } from "react-icons/im";
import { flex } from '../../../pages/NovaRevisao/styles/finalizationStyles';

interface Props {
    to: string;
    text: string
}

const NavItem = ({to, text}: Props) => {
  return (
    <Box w='120px' display='flex' className={Styles.linksBox}>
      {to == '/newReview' && <Icon boxSize='20px' mr='7px' as={FiPlusCircle} color='#FFFF'/>}
      {to == '/user' && <Icon boxSize='21' mr='7px' as={ImBooks} color='#FFFF' />}
      {to == '/' && <Icon boxSize='21px' mr='7px' as={ImExit} color='#FFFF'/>}
      <Link className={Styles.link} to={to}>{text}</Link>
    </Box>
  )
}

export default NavItem