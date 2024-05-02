import { Message } from "@/models/User";

//Types for api responses
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?:Array<Message>
}