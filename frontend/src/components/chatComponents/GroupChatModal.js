import React,{useState} from 'react'
import {IconButton,Button} from '@chakra-ui/button';
import {Box} from '@chakra-ui/react'
import UserListItem from './UserListItem';
import axios from 'axios';
import {ViewIcon} from '@chakra-ui/icons';
import {useDisclosure} from '@chakra-ui/hooks';
import UserBadgeItem from './UserBadgeItem';
import {useToast} from '@chakra-ui/react';
import {ChatState} from '../../context/Chatprovider.js';

import {FormControl} from '@chakra-ui/form-control';
import { Image, Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,Input
  } from '@chakra-ui/react';

const GroupChatModal=({children})=> {
    const {isOpen,onOpen,onClose}=useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const toast=useToast();
    const {user,chats,setChats}=ChatState();
    const handleSearch=async (query)=>{
        setSearch(query);
        if(!query){
            return;
        }try{
            setLoading(true);
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        }catch(err){
            toast({
                title:"Error Ocurred",
                description:"Failed to Load the search Result",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            })
        }
    }
    const handleSubmit=async ()=>{
        if(!groupChatName || !selectedUsers){
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top",
            })
            return;
        }
        try{
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                },
            };
            const {data}=await axios.post(`http://localhost:5000/api/chat/group`,{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=> u._id)),
            },config);
            setChats([data,...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }catch(error){
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }

    }
    const handleGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:"User Already Add",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd]);
    }
    const handleDelete=(delUser)=>{
            setSelectedUsers(selectedUsers.filter((sel)=> sel._id!==delUser._id));
    }
    return (
        <>
    <span onClick={onOpen}>{children}</span>
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work Sans" display="flex" justifyContent="center">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
                <Input placeholder="Chat Name" mb={3} onChange={(e)=>setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
                <Input placeholder="Add Users eg: John, jane, Doe" mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
            {
                selectedUsers.map((selectedUser)=>(
                    <UserBadgeItem key={user._id} user={selectedUser} handleFunction={()=> handleDelete(selectedUser)} />
                ))
            }
            </Box>
            
            {/* selected users */}
            {/* render searched users */}
            {loading ? (<div>Loading</div>):(searchResult?.slice(0,4).map((user)=> <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)} />)) }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
  )
}

export default GroupChatModal
