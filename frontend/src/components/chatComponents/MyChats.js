import React,{useState,useEffect} from 'react'
import {ChatState} from '../../context/Chatprovider.js';
import {Text} from '@chakra-ui/layout'
import {Box} from '@chakra-ui/react';
import axios from 'axios';
import {useToast} from '@chakra-ui/react';
import {Button} from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading.js';
import {Stack} from '@chakra-ui/layout';
import {getSender} from '../authentication/ChatLogics.js';
import GroupChatModal from './GroupChatModal.js';
function MyChats({fetchAgain}) {
  const [loggedUser,setLoggedUser]=useState()
  const {user,selectedChat,setSelectedChat,chats,setChats}=ChatState();
  const toast=useToast();
  const fetchChats=async()=>{
    try{
      const config={
        headers:{
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data}=await axios.get(`http://localhost:5000/api/chat`,config);
      // console.log(data);
      setChats(data);

    }catch(err){
      toast({
        title:"Error Ocurred",
        description:"Failed to load the chats",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
        })
        
    }
  };
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    
    fetchChats();
  },[fetchAgain])
  
  return (
    <Box display={{base:selectedChat?"none":"flex", md:"flex"}} flexDir="column" alignItems="center" p={3} bg="white" w={{base:"100%",md:"31%"}} borderRadius="lg" borderWidth="1px">
      <Box pb={3} px={3} fontSize={{base:"28px", md:"30px"}}
      fontFamily="Work sans" display="flex" w="100%" justifyContent="space-between" alignItems="center">
        My Chats
        <GroupChatModal>
        <Button display="flex" fontSize={{base:"17px" ,md:"10px" ,lg:"17px"}} rightIcon={<AddIcon/>}>
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
      <Box display="flex" flexDir="column" p={3} bg="#F8F8F8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        {
          chats?(
              <Stack overflowY="scroll">
                {chats.map((chat)=>(
                  <Box onClick={()=> setSelectedChat(chat)} cursor="pointer" bg={selectedChat===chat? "#38B2AC":"#E8E8E8"} color={selectedChat===chat? "white":"black"} px={3} py={2} borderRadius="lg" key={chat._id}>
                    
                    <Text>
                      {!chat.isGroupChat? getSender(loggedUser,chat.users):chat.chatName}
                      {/* {!chat.isGroupChat ? "Saurabh" : "Bagal"} */}
                      {/* TonyStark */}
                    </Text>
                  </Box>
                ))
                }
              </Stack>
          ) : (
            <ChatLoading />
          )
        }
      </Box>
    </Box>
  )
}

export default MyChats
