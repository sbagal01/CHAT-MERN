import React from 'react';
import {IconButton,Button} from '@chakra-ui/button';
import {ViewIcon} from '@chakra-ui/icons';
import {useDisclosure} from '@chakra-ui/hooks';
// import {ChatState} from '../../context/Chatprovider.js';
import { Image, Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
function ProfileModal({user,children}) {
    const {isOpen,onOpen,onClose}=useDisclosure();
    // const {user}=ChatState();
  return (
    <>
      {children?(<span onClick={onOpen}>{children}</span>):(
        <IconButton display={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen}/>
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader fontSize="40px" fontFamily="Work sans" display="flex" justifyContent="center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name} />
            <Text fontSize={{base:"28px" , md:"30px"}} fontFamily="Work sans">
                Email : {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal
