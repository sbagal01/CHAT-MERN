import React,{useState} from 'react'
import {Box,Text} from '@chakra-ui/layout';
import {useDisclosure} from '@chakra-ui/hooks';
import UserBadgeItem from './UserBadgeItem';
import {FormControl} from "@chakra-ui/form-control";
import { Image, 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,Spinner
  } from '@chakra-ui/react';
  import {IconButton,Button} from '@chakra-ui/button';
  import axios from 'axios';
import { ViewIcon } from '@chakra-ui/icons';
import {useToast} from '@chakra-ui/react';
import {ChatState} from '../../context/Chatprovider.js';
import UserListItem from './UserListItem';
import {Input} from '@chakra-ui/input'
const UpdateGroupChat=({fetchAgain, setFetchAgain,fetchMessages})=>{
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName]=useState();
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [renameLoading,setRenameLoading]=useState(false);
    const {selectedChat,setSelectedChat,user}=ChatState();
    const toast=useToast();

    const handleAddUser=async (user1)=>{
      if(selectedChat.users.find((u)=>u._id===user1._id)){
        toast({
          title:"User Already in Group!",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom",
        })
        return;
      }
      if(selectedChat.groupAdmin._id!==user._id){
        toast({
          title:"Only Admins can add Users!",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom",
        })
        return;
      }
      try{
          setLoading(true);
          const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            },
          }
          const {data} =await axios.put('http://localhost:5000/api/chat/groupadd',{
              chatId:selectedChat._id,userId:user1._id
          },config)
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
      }catch(error){
        toast({
          title:"Error Ocurred!",
          description:error.response.data.message,
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom",
        })
        setLoading(false);
      }
    }

    const handleRename=async ()=>{
          if(!groupChatName){
            return;
          }
          try{
              setRenameLoading(true)
              const config={
                headers:{
                  Authorization: `Bearer ${user.token}`
                }}

                const {data}=await axios.put('http://localhost:5000/api/chat/rename',{
                  chatId:selectedChat._id,
                  chatName:groupChatName
                },config);
                setSelectedChat(data);
                setFetchAgain(!fetchAgain)
              setRenameLoading(false);

          }catch(err){
            toast({
              title:"Error Ocurred",
              description:err.response.data.message,
              status:"error",
              duration:5000,
              isClosable:true,
              position:"bottom"
          })
            setRenameLoading(false);
          }
          setGroupChatName("");
    }
    const handleRemove=async (user1)=>{
      if(selectedChat.groupAdmin._id!==user._id && user1._id!==user._id){
        toast({
          title:"Only admins can remove from group",
          status:"error",
          duration:5000,
          isClosable:"true",
          position:"bottom",

        });
        return;
      }
      if(selectedChat.users.length===3){
        toast({
          title:"Group has to be of length 3",
          status:"error",
          duration:5000,
          isClosable:"true",
          position:"bottom",
        })
        return;
        
      }
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.put('http://localhost:5000/api/chat/groupremove',{
            chatId:selectedChat._id,
            userId:user1._id
      },config)
      user1._id===user._id?setSelectedChat(""):setSelectedChat(data);
      fetchMessages();
      setFetchAgain(!fetchAgain);
      setLoading(false);
    }
    const handleSearch=async (query)=>{
      setSearch(query);
      if(!query){
        return;
      }
    try{
        setLoading(true);
        const config={headers:{
            Authorization: `Bearer ${user.token}`,
        },
        };
        const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
        setLoading(false);
        setSearchResult(data);

    }catch(error){
        toast({
            title:"Error Ocurred",
            description:"Failed to Load the search Result",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom-left"
            })
            setLoading(false);
    }
    }
    return (
        <>
        <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen} />
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {
                    selectedChat.users.map((u)=>(
                        <UserBadgeItem key={user._id} user={u} handleFunction={()=>handleRemove(u)} />
                    ))
                }
            </Box>
            <FormControl display="flex">
                <Input placeholder="Chat Name" mb={3} value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
                <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
            </FormControl>
            <FormControl display="flex">
                <Input placeholder="Add User to Group" mb={1} onChange={(e)=>handleSearch(e.target.value)}/>

            </FormControl>
            {
              loading?(
                <Spinner size="lg" />
              ):(
                searchResult?.map((user)=>(
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}/>
                ))
              )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>

  )
}

export default UpdateGroupChat
