import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";



export async function POST(request: Request){
    await dbConnect();

    try {
        const {username,code}=await request.json();

        const decodedUsername=decodeURIComponent(username)

        const User=await UserModel.findOne({username:decodedUsername});
        if(!User){
        return Response.json({
            success: false,
            message:"User not found"
        },{status:500})
        }

        const isCodeValid=User.verifyCode === code;
        const isCodeExpired=new Date(User.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeExpired){
            User.isVerified=true;
            await User.save();
            return Response.json({
            success: true,
            message:"Verified successfully"
            },{status:200})
        }

        else if(!isCodeExpired){
                return Response.json({
                    success: false,
                    message:"Code is expired"
                    },{status:500})
        }

        else{
            return Response.json({
                success: false,
                message:"Incorrect code"
                },{status:500})
        }
    } catch (error) {
        console.error("Error verifying code",error);
        return Response.json({
            success: false,
            message:"Error verifying code"
        },{status:500})
    }
}