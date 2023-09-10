import React,{useState,useEffect} from 'react'
import {ChatState} from '../../context/Chatprovider';

import './Style1.css'
import {Box,Text} from '@chakra-ui/layout';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Lottie from 'lottie-react';
import axios from 'axios';
import {useToast} from '@chakra-ui/react';
import {Spinner,FormControl,Input} from '@chakra-ui/react';
import {IconButton} from '@chakra-ui/button'
import {getSender,getSenderFull} from '../authentication/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChat from './UpdateGroupChat';
import Scrollable from './Scrollable.js';
import io from 'socket.io-client'
import animationData from './lotte.json';
const ENDPOINT="http://localhost:5000";
var socket,selectedChatCompare;

function SingleChat({fetchAgain,setFetchAgain}) {
  const [loading,setLoading]=useState(false);
  const [messages,setMessages]=useState([]);
  const [newMessage,setNewMessage]=useState();
  const {user,selectedChat,setSelectedChat,notification,setNotification}
  =ChatState();
  const [socketConnected,setSocketConnected]=useState();
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);
  const toast=useToast()

  

  const fetchMessages=async()=>{
    if(!selectedChat) return;
    try{
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      };
      setLoading(true);
      const {data}=await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,config);
      setMessages(data);
      // console.log(messages);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    }catch(error){
      toast({
        title:"Error Ocurred",
        description:"Failed to load the Message",
        status:"error",
        duration:5000,
        position:"bottom"
      })
    }
  }

  const sendMessage=async (event)=>{
    if(event.key==='Enter' && newMessage){
      socket.emit("stop typing",selectedChat._id);
      try{
        const config={
          headers:{
            "Content-type":"application/json",
            Authorization:`Bearer ${user.token}`
          }
        }
        setNewMessage("");
        const {data}=await axios.post('http://localhost:5000/api/message',{
          content:newMessage,
          chatId:selectedChat._id,
        },config);
        // console.log(data);
        socket.emit('new message',data)
        setMessages([...messages,data]);
      }catch(error){
        toast({
          title:"Error Ocurred!",
          description:"Failed to send the message",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom"
        });
      }
    }
 }
  
  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit('setup',user);
    socket.on('Connected',()=>(
      setSocketConnected(true)
    ));
    socket.on("typing",()=> setIsTyping(true))
    socket.on("stop typing", ()=>setIsTyping(false) );
  },[])

  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat;

  },[selectedChat])
  console.log(notification,'---')
  useEffect(()=>{
    socket.on('message received',(newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id !==newMessageReceived.chat._id){
        //give notification
          if(!notification.includes(newMessageReceived)){
            setNotification([newMessageReceived,...notification]);
            setFetchAgain(!fetchAgain)
          }
      }else{
        setMessages([...messages,newMessageReceived])
        //if selectedChat is not from the one who sent newMessage it should just populated in messages table
      }
    })
  })

   const typingHandler=(e)=>{
    setNewMessage(e.target.value);
      //typing indicator logic
      if(!socketConnected) return;
      if(!typing){
        setTyping(true);
        socket.emit("typing",selectedChat._id);
      }
      let lastTypingTime=new Date().getTime();
      let timerLength=3000;
      setTimeout(()=>{
        let timeNow=new Date().getTime();
        let timeDiff=timeNow-lastTypingTime;
        if(timeDiff >= timerLength && typing){
          socket.emit("stop typing", selectedChat._id)
          setTyping(false);
        }
      },timerLength)
   }
    return (
    <>
      {
        selectedChat?(
            <>
            <Text fontSize={{base:"28px", md:"30px"}} pb={3} px={2} w="100%" fontFamily="Work sans" display="flex" justifyContent={{base:"space-between"}} alignItems="center"
            >
            <IconButton display={{base:"flex", md:"none"}} icon={<ArrowBackIcon/>} onClick={()=>setSelectedChat("")} />
            {!selectedChat.isGroupChat?(
                <>{getSender(user,selectedChat.users)}
                <ProfileModal user={getSenderFull(user,selectedChat.users)} />
                </>
            ):(
                <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                </>
            )

            }
            </Text>
                <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
                  {loading?(
                    <Spinner size="x1" w={20} h={20} alignSelf="center" margin="auto"/>
                  ):(
                    <div className="messages">
                        {/* {} */}
                      <Scrollable messages={messages}/>
                    </div>
                  )}
                  <FormControl onKeyDown={sendMessage} mt={3}isRequired>
                    {isTyping?<div><Lottie
                     animationData={animationData} loop={true} style={{marginBottom:15, marginLeft:0,width:70, }}/></div>:(<></>)}
                    <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message ..." onChange={typingHandler} value={newMessage}/>
                  </FormControl>
                </Box>
            </>
        ):(
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3x1" pb={3} fontFamily="Work sans">
                        Click a User to start Chatting
                    </Text>
                </Box>
        )
      }
    </>
  )
}

export default SingleChat
