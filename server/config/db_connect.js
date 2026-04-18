import mongoose from "mongoose";

mongoose.connect(process.env.DB_CONNECT,).then(()=>{
    console.log("DB connected sucessfully")
}).catch((err)=>{
    console.log("Error in connecting db:",err)
    process.exit(1);
})