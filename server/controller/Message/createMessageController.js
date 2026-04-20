import MessageModel from "../../model/Message.model.js";

export async function createMessageController(req,res)
{
    try {
        const {conversationId,message,senderMobileNumber,type} = req.body

        if(!conversationId || !message || !senderMobileNumber || !type)
        {
            return res.status(400).json({
                message:"ConversationId , message,senderMobileNumber and type is required",
                isSuccess:false
            })
        }
        if(!/^[6-9]\d{9}/.test(senderMobileNumber))
        {
            return res.status(400).json({
                message: "Sender Mobile number must start with 6-9 and must have exact 10 digit",
                isSuccess:false
            })
        }
        
        const messageDoc = await MessageModel.create({
            conversationId,
            type,
            senderMobileNumber,
            content : {
                text:message
            }
        })

        if(!messageDoc)
        {
            throw new Error("Error in creating the new Message")
        }

        return res.status(201).json({
            message:"New Message is created",
            isSuccess:true,
        })

    } catch (error) {
        console.log("Error in create Message Controller:",error)

        if(error.name === 'ValidationError')
        {
            return res.status(400).json({
                message: error.message,
                isSuccess:false,
            })
        }
        if(error.name === 'CastError')
        {
            return res.status(400).json({
                message:error.message,
                isSuccess:false,
            })
        }
        if(error.code === 11000)
        {
            return res.status(409).json({
                message: error.message,
                isSuccess:false,
            })
        }
        return res.status(500).json({
            message:"Internal Server Error",
            isSuccess:false
        })
    }
}