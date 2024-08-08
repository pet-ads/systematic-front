import { Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

interface Props{
    show: Dispatch<SetStateAction<boolean>>;
    scaleHolder: React.Dispatch<React.SetStateAction<number[]>>
}

function NumberScaleModal({show}: Props) {
    const { isOpen, onClose, onOpen } = useDisclosure();
    
    useEffect(() => {
        onOpen();
    }, []);

    function close(){
        show(false);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Values to number scale
                    <ModalCloseButton onClick={close}/>
                </ModalHeader>
                <ModalBody>
                    
                <FormControl>

                    <FormLabel>Min</FormLabel>
                    <NumberInput mb={"2rem"} defaultValue={0} onChange={handleMinimalValue}>      

                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>

                    </NumberInput>

                    <FormLabel>Max</FormLabel>
                    <NumberInput defaultValue={5} onChange={handleMaximalValue}>

                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>

                    </NumberInput>

                    </FormControl>

                </ModalBody>
                <ModalFooter>
                    <Button onClick={close}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default NumberScaleModal