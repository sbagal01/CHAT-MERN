import React,{useState} from 'react';
import {FormControl, FormLabel} from '@chakra-ui/form-control'
import {useHistory} from 'react-router-dom';
import {Button} from '@chakra-ui/button';
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from '@chakra-ui/react'
import {VStack} from '@chakra-ui/react';
import axios from 'axios';
export default function Signup() {
  const history=useHistory();
  const [name, setName] = useState();
  const [show,setShow]=useState(false);
  const [email, setEmail] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading,setLoading]=useState(false);
  const toast=useToast();

  const handleClick=()=>{
    setShow(!show);
  }
  const postDetails=(pics)=>{
    setLoading(true);
    if(pics===undefined){
       toast({
        title:"Please Select an Image!",
        status:"warning",
        duration:"5000",
        isClosable:true,
        position:"bottom",
       }) 
       return;
    }
    if(pics.type==="image/jpeg" || pics.type==="image/png"){
        const data=new FormData();
        data.append("file",pics);
        data.append("upload_preset","chat-app");
        data.append("cloud_name","dffnnwjri");
        fetch("https://api.cloudinary.com/v1_1/dffnnwjri",{
          method:"post",
          body:data,
        }).then((res)=>res.json()).then((data)=>{
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        }).catch((err)=>{
          console.log(err);
          setLoading(false);
        });
    }else{
      toast({
        title:"Please select an image!",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
      setLoading(false);
      return;
    }
  };
  const submitHandler=async ()=>{
    if(!name || !email ||!password ||!confirmPassword){
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
    if(password!==confirmPassword){
      toast({
        title:"passwords do not match",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      // setLoading(false);
      return;
    }
    try{
        const config={
          headers:{
            "Content-type":"application/json",
          },
        };
        const { data }=await axios.post("/api/user",{
          name,email,password,pic
        },config);
        toast({
          title:"Registration Successful",
          status:"success",
          duration:5000,
          isClosable:true,
          position:"bottom"
        });
        localStorage.setItem("userInfo",JSON.stringify(data));
        setLoading(false);
        history.push('/')
    }catch(error){
      toast({
        title:"Error Ocurred",
        description:error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      setLoading(false);
    }
  }
  return (
    <VStack spacing='5px'>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input type="text" placeholder="Enter Your Name" onChange={(e)=>setName(e.target.value)} />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="text" placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input type={show?"text":"password"} placeholder="Enter Your Password" onChange={(e)=>setPassword(e.target.value)} />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>{
            show?"Hide":"Show"
          }</Button>
        </InputRightElement>
        </InputGroup>
        
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Your Password</FormLabel>
        <InputGroup>
        <Input type={show?"text":"password"} placeholder="Enter Your Password" onChange={(e)=>setConfirmPassword(e.target.value)} />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>{
            show?"Hide":"Show"
          }</Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload Picture</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])}/>
      </FormControl>
      <Button colorScheme="blue" width="100%" style={{marginTop:15}} isLoading={loading} onClick={submitHandler}>SignUp</Button>
</VStack>
  )
}
