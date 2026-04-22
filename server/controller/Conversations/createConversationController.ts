import type { Request, Response } from "express";
import ConversationModel from "../../model/Conversation.model.ts";
import UserModel from "../../model/User.model.ts";

interface CreateConversationBody {
  type: "Direct" | "Group";
  participants: string[];
  name: string | null;
}

export async function createConversation(
  req: Request<{}, {}, CreateConversationBody>,
  res: Response,
) {
  try {
    const { type, participants, name } = req.body;

    if (!type || !participants) {
      return res.status(400).json({
        message: "type and participants are required",
        isSuccess: false,
      });
    }

    if (!Array.isArray(participants)) {
      return res.status(400).json({
        message: "participants must be an array",
        isSuccess: false,
      });
    }

    if (type === "Direct") {
      if (participants.length !== 2) {
        return res.status(400).json({
          message: "Direct Conversation must have exactly two participants",
          isSuccess: false,
        });
      }
    } else if (type === "Group") {
      if (!name) {
        return res.status(400).json({
          message: "Group must have name",
          isSuccess: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "Conversation type must be either Direct or Group",
        isSuccess: false,
      });
    }

    const usersDocs = await UserModel.find({
      mobileNumber: { $in: participants },
    }).select("_id");

    if (usersDocs.length !== participants.length) {
      return res.status(400).json({
        message: "Some participants not found",
        isSuccess: false,
      });
    }

    const usersId = usersDocs.map((user) => user._id);

    // check for already exist conversation
    const isAlreadyConversationHappen = await ConversationModel.findOne({
      participants: { $all: usersId },
    });

    if (isAlreadyConversationHappen) {
      return res.status(400).json({
        message: "Conversation has Already been created",
        isSuccess: false,
      });
    }

    const conversation = await ConversationModel.create({
      type,
      participants: usersId,
      name: type === "Group" ? name : null,
    });

    return res.status(201).json({
      message: "Conversation created",
      isSuccess: true,
      conversationId: conversation.conversationId,
    });
  } catch (error) {
    console.log("Error in createConversation Controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      isSuccess: false,
    });
  }
}
