import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Box
  } from '@chakra-ui/react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

export default function Dashboard(){
    
    const progressValue: number = 60;
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button bgColor={"#301E1A"} color={"#C9D9E5"} ml={"5rem"} mt={4} w={"160px"} h={"25px"} onClick={onOpen}>Progress Dashboard</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign='center' paddingBottom='30px'>Revision Progress</ModalHeader>   
                    <ModalCloseButton />
                    <ModalBody textAlign='center'>
                    <Box>
                        <CircularProgress value={progressValue} size="120px" color="#EF476F">
                            <CircularProgressLabel>{progressValue}%</CircularProgressLabel>
                        </CircularProgress>
                        <CircularProgress ml={"5rem"} value={progressValue} size="120px" color="#235789">
                            <CircularProgressLabel>{progressValue}%</CircularProgressLabel>
                        </CircularProgress>
                    </Box>
                    <Box mt={'3rem'}>
                        <CircularProgress value={progressValue} size="120px" color="#FB8B24">
                            <CircularProgressLabel>{progressValue}%</CircularProgressLabel>
                        </CircularProgress>
                        <CircularProgress ml={"5rem"} value={progressValue} size="120px" color="#226F54">
                            <CircularProgressLabel>{progressValue}%</CircularProgressLabel>
                        </CircularProgress>
                    </Box>
                    </ModalBody>
                    <ModalFooter paddingTop='30px'>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    </>
    );
}