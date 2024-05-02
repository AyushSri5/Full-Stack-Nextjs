//ALL things are written here
import { NextAuthOptions } from "next-auth/";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

//Creating a custom sign in page created by next-auth behind the scenes as HTML form
export const authOptions: NextAuthOptions = {
    providers:[CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials:any): Promise<any> {
            //Credentials.identifier
            await dbConnect();
            try {
                const user=await UserModel.findOne({
                    $or:[
                        {email:credentials.identifier},
                        {username:credentials.identifier}
                    ]
                })

                if(!user){
                    throw new Error("No user found");
                }

                if(!user.isVerified){
                    throw new Error("User is not verified");
                }

                const isPassword=await bcrypt.compare(credentials.password, user.password);

                if(isPassword){
                    return user;
                }
                else{
                    throw new Error("Password is not correct");
                }
            } catch (error:any) {
                throw new Error(error);
            }
          }
    })],
    callbacks:{
        //We take a large token so that we take out data from user and put into the session
        async session({ session,  token }:any) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMessages=token.isAcceptingMessages;
                session.user.username=token.username;
            }
            return session
          },
          async jwt({ token, user }:any) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified=user.isVerified;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.username=user.username;
            }
            return token
          }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}