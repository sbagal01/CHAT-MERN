const jwt=require('jsonwebtoken');
const User=require('../models/userModel.js');
const expressHandler=require('express-async-handler');

const protect=expressHandler(async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        try{
            token=req.headers.authorization.split(" ")[1];
            //decodes token id
            const decoded=jwt.verify(token,"saurabh");
            req.user=await User.findById(decoded.id).select("-password")
            next();
        }catch(err){
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if(!token){
        res.status(401);
        throw new Error("Not authorized ,No token")
    }
})
module.exports={protect};