import type {Request,Response} from 'express'
import MessageModel from '../../model/Message.model.ts'
import ConversationModel from '../../model/Conversation.model.ts'

interface FetchMessageForUserParam{
    conversationId:string
}

export async function fetchAllMessagesForSpecificUserController(req:Request<FetchMessageForUserParam>,res:Response)
{
    try {

        const {conversationId} = req.params

        if(!conversationId)
        {
            return res.status(400).json({
                message:"Conversation id is required",
                isSuccess:false
            })
        }

        // fetch conversation
            const conversationDoc = await ConversationModel.findOne({
                conversationId
            })
        
            if(!conversationDoc)
            {
                return {
                    message:"Can not find the Conversation",
                    isSuccess:false
                }
            }

        const messagesDoc = await MessageModel.find({
            conversationId : conversationDoc._id
        }).select("senderMobileNumber type content createdAt")
        
        return res.status(200).json({
            message:"Messages found",
            isSuccess: true,
            messages:messagesDoc
        })

    } catch (error) {
        
        console.log("Error in fetch All messaged for user :",error)

        return res.status(500).json({
            message:"Internal Server Error",
            isSuccess:false
        })

    }
}