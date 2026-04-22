import type { Request, Response } from 'express';
import { createMessage } from '../../services/createMessage.service.ts';

interface CreateMessageBody {
    conversationId: string;
    message: string;
    senderMobileNumber: string;
    type: "Text" | "Image" | "Document";
}

export async function createMessageController(req:Request<{},{},CreateMessageBody>,res:Response)
{
    try {
        const {conversationId,message,senderMobileNumber,type} = req.body

        // if(!conversationId || !message || !senderMobileNumber || !type)
        // {
        //     return res.status(400).json({
        //         message:"ConversationId , message,senderMobileNumber and type is required",
        //         isSuccess:false
        //     })
        // }
        // if(!/^[6-9]\d{9}$/.test(senderMobileNumber))
        // {
        //     return res.status(400).json({
        //         message: "Sender Mobile number must start with 6-9 and must have exact 10 digit",
        //         isSuccess:false
        //     })
        // }
        // //  // ✅ fixed regex
        // // if (!/^[6-9]\d{9}$/.test(senderMobileNumber)) {
        // //     return res.status(400).json({
        // //         message: "Sender Mobile number must start with 6-9 and must have exactly 10 digits",
        // //         isSuccess: false,
        // //     });
        // // }
        // const messageDoc = await MessageModel.create({
        //     conversationId,
        //     type,
        //     senderMobileNumber,
        //     content : {
        //         text:message
        //     }
        // })

        // if(!messageDoc)
        // {
        //     throw new Error("Error in creating the new Message")
        // }

        // return res.status(201).json({
        //     message:"New Message is created",
        //     isSuccess:true,
        // })
        const response = await createMessage(conversationId,type,senderMobileNumber,message)

        return res.status(response.status).json({
            message:response.message,
            isSuccess:response.isSuccess
        })

    } catch (error) {
        console.log("Error in create Message Controller:",error)

        if(error instanceof Error && error.name === 'ValidationError')
        {
            return res.status(400).json({
                message: error.message,
                isSuccess:false,
            })
        }
        if(error instanceof Error && error.name === 'CastError')
        {
            return res.status(400).json({
                message:error.message,
                isSuccess:false,
            })
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: number }).code === 11000
        )
        {
            return res.status(409).json({
                message: "Duplicate key error",
                isSuccess: false,
            });
        }

        return res.status(500).json({
            message:"Internal Server Error",
            isSuccess:false
        })
    }
}
