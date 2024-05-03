import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User";



export async function POST(request: Request){
    await dbConnect();

    const {username,content} = await request.json();

    try {
        const user=await UserModel.findOne({username}).exec();

        if(!user){
            return Response.json({
                success: false,
                message:"Not Found User"
            },{status:404})
        }

        //is User accepting message

        if(!user.isAcceptMessage){
            return Response.json({
                success: false,
                message:"User is not accepting"
            },{status:403})
        }

        const newMessage={content,createdAt:new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
          );
    } catch (error) {
        console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
    }
}