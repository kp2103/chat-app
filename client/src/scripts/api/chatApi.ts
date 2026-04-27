import type { Conversation, Message } from '../types/types.js';
import { mapParticipant } from '../utils/helpers.js';
import { handleApiRequest } from './client.js';

async function fetchConversations(mobileNumber: string): Promise<Conversation[]> {
	const response = await handleApiRequest<{ conversations: any[] }>(
		`conversations/${mobileNumber}`,
	);
	const { conversations } = response;

	return conversations.map((conv): Conversation => {
		const conversation = {
			conversationId: conv.conversationId,
			latestMessage: conv.latestMessage,
			latestTime: conv.latestTime,
			participants: conv.participants.map(mapParticipant),
		};

		if (conv.type === 'Group') {
			return {
				...conversation,
				type: 'Group',
				groupName: conv.name,
				groupAvatarUrl: conv.groupAvatarURL,
			};
		} else {
			return {
				...conversation,
				type: 'Direct',
			};
		}
	});
}

async function fetchMessages(roomId: string): Promise<Message[]> {
	const response = await handleApiRequest<{ messages: any[] }>(`messages/${roomId}`);
	const { messages } = response;

	return messages.map(
		(msg): Message => ({
			messageId: msg._id,
			message: msg.content.text,
			timeStamp: msg.createdAt,
			senderMobileNumber: msg.senderMobileNumber,
			userMobileNumber: '',
		}),
	);
}

export { fetchConversations, fetchMessages };
