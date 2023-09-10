import React,{useState} from 'react'
import axios from 'axios';
import {Text} from '@chakra-ui/layout'
import {Box,Avatar,Drawer,DrawerOverlay,DrawerContent,DrawerHeader,Input,useToast} from '@chakra-ui/react';
import {DrawerBody} from '@chakra-ui/modal';
import {Menu,MenuButton,MenuList,MenuItem,MenuDivider} from '@chakra-ui/menu';
import { Tooltip } from "@chakra-ui/tooltip"
import {Button} from '@chakra-ui/button';
import {ChevronDownIcon,BellIcon} from '@chakra-ui/icons';
import ProfileModal from './ProfileModal';
import {ChatState} from '../../context/Chatprovider.js';
import {useHistory} from 'react-router-dom';
import ChatLoading from './ChatLoading';
import {useDisclosure} from '@chakra-ui/hooks';
import {Effect} from 'react-notification-badge';

import NotificationBadge from 'react-notification-badge';

import {getSender} from '../authentication/ChatLogics'
import {Spinner} from '@chakra-ui/spinner';
import UserListItem from './UserListItem';
export default function Sidebar() {
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [loadingChat,setLoadingChat]=useState();

    const history=useHistory();
    const {isOpen,onOpen,onClose}=useDisclosure();
    const {user,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();
    const toast=useToast();

    const logoutHandler=()=>{
        localStorage.removeItem("userInfo");
        history.push('/');
    }
    const handleSearch=async ()=>{
        if(!search){
            toast({
                title:"Please enter something in Search",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
                })
                return ;
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
                return;
        }
    };
    
    const accessChat=async (userId)=>{
        try{
            setLoadingChat(true);
            const config={headers:{
                "Content-type":"application/json",
                Authorization: `Bearer ${user.token}`,
            }};
            const {data}=await axios.post(`http://localhost:5000/api/chat`,{userId},config);
            if(!chats.find((c)=> c._id===data._id)){
                setChats([...chats,data]);
              }
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        }catch(err){
            toast({
                title:"Error Ocurred",
                description:err.message,
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
                })
                return;
        }
    }
    return (
        <>
    <Box display="flex" bg="white" alignItems="center" justifyContent="space-between" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
        <i class="fa fa-search" aria-hidden="true"></i>
        <Text d={{base:"none",md:"flex"}}  px="4">Search User</Text>
        </Button>
      </Tooltip>
      <Text fontSize="2x1" fontFamily="Work sans">ChatApp</Text>
      <div>
      <Menu>
            <MenuButton p={1}>
                <NotificationBadge count={notification.length} effect={Effect.SCALE} />
            <BellIcon fontSize="2x1" m={1}/>

            </MenuButton>

            <MenuList pl={2}>
                {!notification.length && 'No new Messages'}
                {notification.map((notif)=>(
                    <MenuItem key={notif._id} onClick={()=>{
                        setSelectedChat(notif.chat)
                        setNotification(notification.filter((n)=>n!==notif))
                    }}>
                        {notif.chat.isGroupChat? `New Message in ${notif.chat.chatName}`:`New message from ${getSender(user,notif.chat.users)}`}
                    </MenuItem>
                ))}
                
            </MenuList>
        </Menu>
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
                <ProfileModal user={user}>
                {/* <MenuItem>My profile</MenuItem> */}
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
        </Menu>
      </div>
        
    </Box>
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
            <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
            <Box display="flex" pb={2}>
                <Input placeholder="Search by Name or email" mr={2} value={search} onChange={(e)=>setSearch(e.target.value)} />
                <Button display="flex" onClick={handleSearch} pb={2} >Go</Button>
            </Box>
            {loading?(
                <ChatLoading />
            ):(
                searchResult?.map((user)=>(
                    <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)} />
                ))
                
            )}
            {loadingChat&& <Spinner m1="auto" display="flex" />}
        </DrawerBody> 
            </DrawerContent>
           
        </DrawerOverlay>
    </Drawer>
    </>
  )
}
