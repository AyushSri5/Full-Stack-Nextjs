import { getServerSession } from "next-auth/";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";


export async function POST(request: Request){
    await dbConnect();

    const session=await getServerSession(authOptions);

    const user:User=session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userId=user._id;
    const {acceptMessages}=await request.json()

    try {
        const updatedUser=await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptMessage: acceptMessages},
            {new :true}
        );

        if(!updatedUser){
            return Response.json({
                success: false,
                message:"Failed to update user status to accept message: "
            },{status:401})
        }
        else{
            return Response.json({
                success: true,
                message:"Message acceptance status updated successfully"
            },{status:200})
        }
    } catch (error) {
        console.log("Failed to update user status to accept message: " );
        return Response.json({
            success: false,
            message:"Failed to update user status to accept message: "
        },{status:500})
    }
}

export async function GET(request: Request){
    await dbConnect();

    const session=await getServerSession(authOptions);

    const user:User=session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userId=user._id;

    try {
        const foundUser=await UserModel.findById(userId);

    if(!foundUser){
        return Response.json({
            success: false,
            message:"Failed to found user status to accept message: "
        },{status:404})
    }
    else{
        return Response.json({
            success: true,
            isAcceptMessage:foundUser.isAcceptMessage
        },{status:200})
    }
    } catch (error) {
        console.log("Failed to update user status to accept message: " );
        return Response.json({
            success: false,
            message:"Error in getting message acceptance status"
        },{status:500})
    }
}