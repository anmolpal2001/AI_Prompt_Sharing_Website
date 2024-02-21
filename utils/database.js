import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    mongoose.set('strictQuery',true);

    if(isConnected){
        console.log("MongoDB is already connected");
        return;
    }

    try{
        const conn = await mongoose.connect(process.env.DATABASE_URL)
        isConnected = true;
        console.log("MongoDB is connected successfully");
    }
    catch(error){
        console.log("Error in connecting to MongoDB", error);
    }
}