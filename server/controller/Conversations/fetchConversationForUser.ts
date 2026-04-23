import type { Request, Response } from 'express';
import ConversationModel from '../../model/Conversation.model.ts';
import UserModel from '../../model/User.model.ts';
import { getLatestConversations } from '../../services/getLatestMessageForConversation.service.ts';

interface FetchConversationForUserParams {
	mobileNumber: string;
}
interface ConversationPreview {
	type: 'Direct' | 'Group';
	name: string;
	conversationId: string;
	latestMessage: string;
	latestTime: Date;
}

export async function fetchConversationForUser(
	req: Request<FetchConversationForUserParams>,
	res: Response,
) {
	try {
		const { mobileNumber } = req.params;

		if (!mobileNumber) {
			return res.status(400).json({
				message: 'Mobile number can not be empty',
				isSuccess: false,
			});
		}

		// check regex
		if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
			return res.status(400).json({
				messsage: 'Mobile number must be start with 6-9 and have only 10 digit',
				isSuccess: false,
			});
		}

		const userDoc = await UserModel.findOne({
			mobileNumber,
		}).select('_id');

		if (!userDoc) {
			return res.status(400).json({
				message: 'No user exist with this mobile number',
				isSuccess: false,
			});
		}

		const conversationDoc = await ConversationModel.find({
			participants: userDoc._id,
		})
			.select('conversationId type name participants')
			.populate('participants', 'firstName lastName mobileNumber avatarURL')
			.lean<ConversationPreview[]>();

		if (conversationDoc.length == 0) {
			return res.status(200).json({
				message: 'There is no chat found with this user',
				isSucess: true,
			});
		}
		await Promise.all(
			conversationDoc.map(async (doc) => {
				const res = await getLatestConversations(doc.conversationId);

				if (res) {
					doc.latestMessage = res.content.text;
					doc.latestTime = res.createdAt;
				}

				return doc;
			}),
		);

		return res.status(200).json({
			message: 'Conversation found',
			isSuccess: true,
			conversations: conversationDoc,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal server error',
			isSuccess: false,
		});
	}
}
