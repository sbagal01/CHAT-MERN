import React from 'react'
import { Container,Box,Text,Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from '../authentication/Login';
import Signup from '../authentication/Signup';
import {useHistory} from 'react-router-dom';
import {useEffect} from 'react'
export default function Home() {
  const history=useHistory();
      // because of this useEffect we are directly routing to /chat
    useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("userInfo"));
        
        if(user){
            history.push("/chat");
        }
            
    },[history]);
  return <Container maxW='xl' centerContent>
      <Box d="flex" p={3} bg="white" w="100%" m="40px 0 15px 0" textAlign={"center"} borderRadius="lg" borderWidth="1px">
        <Text fontSize="3xl" fontFamily="Work sans" color="black">CHATAPP</Text> 
      </Box >
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color="black">
      <Tabs variant='soft-rounded'>
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>
    </Container>
}
