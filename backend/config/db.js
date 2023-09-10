const mongoose=require('mongoose');
const dotenv=require('dotenv');
const url="mongodb+srv://test:test123@cluster0.4nol0av.mongodb.net/?retryWrites=true&w=majority";
dotenv.config();
const connectDb=async()=>{
    try{
        const conn=await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log(`MongoDB connected ${conn.connection.host}`);
    }catch(err){
        console.log(err)
        process.exit();
    }
}
module.exports=connectDb