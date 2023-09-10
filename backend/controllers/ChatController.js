const expressHandler=require('express-async-handler');
const generateToken=require('../config/generateToken.js');
const Chat=require('../models/chatModel.js');
const User=require('../models/userModel.js');
const accessChat=expressHandler(async (req,res)=>{
    let {userId}=req.body;
    if(!userId){
        console.log("user params not sent with request");
        return res.sendStatus(400);
    }
    let isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}   
        ],
    }).populate("users","-password").populate("latestMessage");
    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email"
    });
    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],
        };
        try{
            const createdChat=await Chat.create(chatData);
            const fullData=await Chat.findOne({
                _id:createdChat._id
            }).populate("users","-password");
            res.status(200).json(fullData);
        }catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    }
    
})

const fetchChats=expressHandler(async (req,res)=>{
    try{
        await Chat.find({users: {$elemMatch:{$eq:req.user._id}}}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt:-1}).then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email"
            });
            res.status(200).send(results);
        })
        
    }catch(error){
        res.status(400);
            throw new Error(error.message);
    }
})

const createGroupChat=expressHandler(async (req,res)=>{
    console.log('Started');
    if(!req.body.name || !req.body.users){
        return res.sendStatus(400).send("Please fill all the fields")
    }
    var users=JSON.parse(req.body.users);
    if(users.length<2){
        return res.status(400).send("More than 2 users are required");
    }
    users.push(req.user);
    try{
        const groupChat=await Chat.create({
            groupAdmin:req.user,
            users:users,
            isGroupChat:true,
            chatName:req.body.name
        })
        const fullGroupChat=await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password");
        res.status(200).json(fullGroupChat);
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }

})
const renameGroup=expressHandler(async (req,res)=>{
    const {chatId,chatName}=req.body;
    const updatedChat=await Chat.findByIdAndUpdate(chatId,{
        chatName
    },{
        new:true
    }).populate("users","-password").populate("groupAdmin","-password");
    if(!updatedChat){
        res.status(404);
        throw new Error("Chat Not found");

    }else{
        res.json(updatedChat);
    }

})
const addToGroup=expressHandler(async (req,res)=>{
    const {chatId,userId}=req.body;
    const added=await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    },{new:true}).populate("users","-password").populate("groupAdmin","-password");
    if(!added){
        res.status(404);
        throw new Error("Chat Not found");

    }else{
        res.json(added);
    }


})
const removeFromGroup=expressHandler(async (req,res)=>{
    const {chatId,userId}=req.body;
    const removed=await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
    },{new:true}).populate("users","-password").populate("groupAdmin","-password");
    if(!removed){
        res.status(404);
        throw new Error("Chat Not found");

    }else{
        res.json(removed);
    }
})

module.exports={accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup};