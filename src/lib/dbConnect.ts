import mongoose from "mongoose";

type ConnectionObject ={
    //Optional value for ?
    isConnected?:number
}

const connection:ConnectionObject ={}


//void means don't care about return type
async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected");
        return;
    }

    try {
       const db= await mongoose.connect("mongodb://127.0.0.1:27017/");
       connection.isConnected=db.connections[0].readyState;

       console.log("Database connected successfully");
       
    } catch (error) {
        console.log("Failed to connect to database: " ,error);
        
        process.exit(1);
    }
}

export default dbConnect;