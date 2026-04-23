import ConversationModel from "../model/Conversation.model.ts"
import MessageModel from "../model/Message.model.ts"

export interface LatestMessageReturType{
    createdAt:Date,
    content:{
        text:string,
    }
} 

export async function getLatestConversations(conversationId:string):Promise<LatestMessageReturType | null>
{
    try {

        if(!conversationId)
            throw new Error("conversation id is empty")

        const conversationDoc = await ConversationModel.findOne({
            conversationId
        }).select('_id')
        
        if(!conversationDoc)
            throw new Error("No Conversation Exist with this id")

        const messageDoc = await MessageModel.findOne({
            conversationId:conversationDoc?._id
        }).sort({createdAt:-1}).select('createdAt content').lean<LatestMessageReturType>()

        return messageDoc

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error in get latest conversation")
    }
}