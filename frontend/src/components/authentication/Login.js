import React,{useState} from 'react'
import {FormControl, FormLabel} from '@chakra-ui/form-control'
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {Button} from '@chakra-ui/button';
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from '@chakra-ui/react'
import {VStack} from '@chakra-ui/react';
export default function Login() {
  const [show,setShow]=useState(false);
  const history=useHistory();
  const toast=useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading,setLoading]=useState(false);
  const handleClick=()=>{
    setShow(!show);
  }
  const submitHandler=async ()=>{
    setLoading(true);
    if(!email ||!password){
      toast({
        title:"Please fill all the fields",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      setLoading(false);
      return;
    }
    try{
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };
      const { data }=await axios.post("/api/user/login",{
        email,password
      },config);
      toast({
        title:"Login Successful",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      history.push('/chat')
    }catch(error){
      toast({
        title:"Error Ocurred",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      setLoading(false);
    }
  };
  return (
<VStack spacing='5px'>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="text" value={email}placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input type={show?"text":"password"} placeholder="Enter Your Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>{
            show?"Hide":"Show"
          }</Button>
        </InputRightElement>
        </InputGroup>
        
      </FormControl>

      <Button colorScheme="blue" width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>Login</Button>
      <Button variant="solid" colorScheme="red" width="100%" onClick={()=>{
        setEmail("guest@example.com");
        setPassword("123456")
      }}>Get Guest Credentials</Button>
</VStack>
  )
}
