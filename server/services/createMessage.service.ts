import ConversationModel from "../model/Conversation.model.ts";
import MessageModel from "../model/Message.model.ts";

export async function createMessage(
  conversationId: string,
  type: string,
  senderMobileNumber: string,
  message: string,
) {
  try {
    if (!conversationId || !message || !senderMobileNumber || !type) {
      return {
        message:
          "ConversationId , message,senderMobileNumber and type is required",
        isSuccess: false,
        status:400
      };
    }
    if (!/^[6-9]\d{9}$/.test(senderMobileNumber)) {
      return {
        message:
          "Sender Mobile number must start with 6-9 and must have exact 10 digit",
        isSuccess: false,
        status:400
      };
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

    const messageDoc = await MessageModel.create({
      conversationId : conversationDoc?._id,
      type,
      senderMobileNumber,
      content: {
        text: message,
      },
    });

    if (!messageDoc) {
      throw new Error("Error in creating the new Message");
    }

    return {
      message: "New Message is created",
      isSuccess: true,
      status:201
    };
  } catch (error) {
    console.log("Error in createMessafe server:", error);

    if (
      error instanceof Error &&
      (error.name === "ValidationError" || error.name === "CastError")
    ) {
      return {
        message: error.message,
        isSuccess: false,
        status:500
      };
    }

    // if(
    //     typeof error === "object" &&
    //     error !== null &&
    //     "code" in error &&
    //     (error as { code?: number }).code === 11000
    // )
    // {
    //     return {
    //         message: "Duplicate key error",
    //         isSuccess: false
    //     }
    // }

    return {
      message: "Internal Server Error",
      isSuccess: false,
      status:500
    };
  }
}
