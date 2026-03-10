import mongoose from "mongoose";

export const dbConnection = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongoDb Connected ${conn.connection.host}`)
    }catch(err){
        console.log(`error in mongo connecition : ${err}`);
        process.exit(1);
    }
}