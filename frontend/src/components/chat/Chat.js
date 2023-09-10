import React,{useState,useEffect} from 'react'
import axios from 'axios';
import {ChatState} from '../../context/Chatprovider.js';
import Sidebar from '../chatComponents/Sidebar.js';
import MyChats from '../chatComponents/MyChats.js';
import ChatBox from '../chatComponents/ChatBox.js';
import {Box} from '@chakra-ui/react';

function Chat() {
  const {user}=ChatState();
    const [fetchAgain,setFetchAgain]=useState(false);
  return (
    <div style={{width:"100%"}} className="chat">
      {user && <Sidebar/>}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default Chat
