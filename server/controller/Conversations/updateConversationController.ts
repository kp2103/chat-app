import type {Request,Response} from 'express'
import ConversationModel from '../../model/Conversation.model.ts'
import UserModel from '../../model/User.model.ts'

interface UpdateConversationNameAndProfileBody{
    name:string,
    groupAvatarURL:string,
    participants:string[]
}

interface UpdateConversationNameAndProfileParams{
    conversationId:string,
}

export async function updateConversationNameAndProfileController(req:Request<UpdateConversationNameAndProfileParams,{},UpdateConversationNameAndProfileBody>,res:Response)
{
    try {
        const {groupAvatarURL,name,participants} = req.body
        const {conversationId} = req.params

        if(!groupAvatarURL || !name || !conversationId)
        {
            return res.status(400).json({
                message:"ConversationId,group profile and name are required",
            })
        }

        // get the users 
        const usersDoc = await UserModel.find({
            mobileNumber: {$in:participants}  
        }).select('_id')

        // if(usersDoc.length === 0)
        // {
        //     return res.status(404).json({
        //         message:"No user Exist with these mobile number"
        //     })
        // }
        const userIds = usersDoc.map((doc)=>doc._id)

        const updatedConversation = await ConversationModel.findOneAndUpdate(
            {conversationId},
            {
                $set:{groupAvatarURL,name},
                $addToSet:{
                    participants:{$each:userIds}
                }
            },
            {new:true,runValidators:true}
        ).select("conversationId type name participants groupAvatarURL")
         .populate("participants", "firstName lastName mobileNumber avatarURL")

        if(!updatedConversation)
        {
            throw new Error("Error in updating Conversation")
        }

        return res.status(200).json({
            message:"Conversation has updated",
            conversation:updatedConversation
        })

    } catch (error) {

        return res.status(500).json({
            message:"Internal server error",
        })
    }
}