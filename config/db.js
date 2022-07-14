import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const db = process.env.REACT_APP_MONGOURI;

const connectDB = async () => {
    try{
        await mongoose.connect(db);
        console.log("MongoDB connected!")
    } catch(err){
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
}

export default connectDB;