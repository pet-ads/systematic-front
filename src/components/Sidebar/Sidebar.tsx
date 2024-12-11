import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';
import Style from './Sidebar.module.css';
import CloseButton from './buttons/CloseButton';
import Navigation from './Navigation';
import AppContext from '../../components/Context/AppContext';

interface Props {
  type: string;
}

const Sidebar = ({ type }: Props) => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('Failed to get the context in Sidebar.');
  }

  const { sidebarState, setSidebarState } = context;

  const isOpen = sidebarState === 'open';

  const toggleSidebar = () => {
    setSidebarState(isOpen ? 'collapsed' : 'open');
  };

  return (
    <motion.div
      className={isOpen ? Style.wrapper : Style.collapsed}
      animate={{
        width: isOpen ? '250px' : '0px',
        borderRadius: isOpen ? '30px' : '50%',
      }}
      transition={{ type: 'just', duration: 0.3 }}
    >
      {isOpen ? (
        <>
          <Box className={Style.closeBtn}>
            <CloseButton isOpen={isOpen} handleToggle={toggleSidebar} />
          </Box>
          <Navigation type={type} />
        </>
      ) : (
        <CloseButton isOpen={isOpen} className={Style.collapsedBtn} handleToggle={toggleSidebar} />
      )}
    </motion.div>
  );
};

export default Sidebar;
