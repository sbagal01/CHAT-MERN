const expressHandler=require('express-async-handler');
const generateToken=require('../config/generateToken.js')
const User=require('../models/userModel')

const allUsers=expressHandler(async(req,res)=>{
const keyword=req.query.search
    ?{
    $or:[
        {name:{ $regex:req.query.search,$options:"i"}}, 
        {email:{ $regex:req.query.search,$options:"i"}},
    ],
}:{};
     const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
     res.send(users);   
})
const registerUser=expressHandler(async (req,res)=>{
    const {name,email,password,pic}=req.body;
    if(!name || !password ||!email){
        res.status(400);
        throw new Error("Please enter all the fields")
    }
    const userExists=await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already Exists");
    }
    const user=await User.create({
        name,email,password,pic,
    })
    if(user){
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("User Not Created");
    }
})

module.exports={registerUser,allUsers}