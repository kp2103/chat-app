import type { Conversation, Message } from '../types/types.js';
import { client } from './client.js';

async function fetchConversations(mobileNumber: string): Promise<Conversation[]> {
	const response = await client<{ conversations: any[] }>(
		`conversations/${mobileNumber}`,
	);
	const { conversations } = response;

	return conversations.map((conv): Conversation => {
		if (conv.type === 'Group') {
			return {
				conversationId: conv.conversationId,
				type: 'Group',
				groupName: conv.name,
				groupAvatarUrl: conv.groupAvatarURL,
				latestMessage: conv.latestMessage,
				latestTime: conv.latestTime,
				participants: conv.participants,
			};
		} else {
			return {
				conversationId: conv.conversationId,
				type: 'Direct',
				latestMessage: conv.latestMessage,
				latestTime: conv.latestTime,
				participants: conv.participants,
			};
		}
	});
}

async function fetchMessages(roomId: string): Promise<Message[]> {
	const response = await client<{ messages: any[] }>(`messages/${roomId}`);
	const { messages } = response;

	return messages.map(
		(msg): Message => ({
			message: msg.content.text,
			timeStamp: msg.createdAt,
			senderMobileNumber: msg.senderMobileNumber,
			userMobileNumber: '',
		}),
	);
}

export { fetchConversations, fetchMessages };
