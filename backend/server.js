const express=require('express');
const cors=require('cors');
const path=require('path');
const chats = require('./data/db.js');
const dotenv=require('dotenv');
const userRoutes=require('./routes/UserRoutes.js');
const chatRoutes=require('./routes/chatRoutes.js');
const messageRoutes=require('./routes/messageRoutes.js');
dotenv.config();
const connectDb = require('./config/db.js');
const {notFound,errorhandler}=require('./middleware/errorMiddleware.js'); 
connectDb();
const app=express();

app.use(cors());
app.use(express.json())
const port=process.env.PORT || 5000;


app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
app.use(notFound);
app.use(errorhandler);


// app.get("/api/chat",(req,res)=>{
//     res.send(chats);
// })

// app.get("/api/chat/:id",(req,res)=>{
//     const singleChat=chats.find((c)=>c._id===req.params.id);
//     res.send(singleChat);
// })
// --deployment--
const __dirName1=path.resolve();


if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirName1,"/frontend/build")));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirName1,"frontend", "build","index.html"));
    })
}else{
    app.get("/",(req,res)=>{
        res.send('API is running Successfully');
    })
}
// --deployment--
const server=app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
})

const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    },
});
io.on("connection",(socket)=>{
    console.log("Connection to socket.io");
    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit('Connected');
    });

    socket.on('join chat',(room)=>{
          socket.join(room);
            console.log('User joined Room' + room);

    })

    socket.on('typing',(room)=>(
        socket.in(room).emit("typing")
    ))
    socket.on("stop typing" ,(room)=>socket.in(room).emit("stop typing"));

    socket.on('new message',(newMessageReceived)=>{
        let chat=newMessageReceived.chat;
        if(!chat.users){
            return console.log('chat.users not defined');
        }
        chat.users.forEach((user)=>{
            if(user._id===newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received",newMessageReceived);
        })
    })
    socket.off('setup',()=>{
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
})