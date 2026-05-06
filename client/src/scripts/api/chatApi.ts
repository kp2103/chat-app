import { userStore } from '../config/store.js';
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
			senderMobileNumber: conv.senderMobileNumber,
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

const chatSearch = document.getElementById('conversation-search') as HTMLInputElement;

const buttonNewChat = document.getElementById('btn-new-chat') as HTMLButtonElement;

buttonNewChat.addEventListener('click', (e) => createConversation(chatSearch.value));

async function createConversation(mobileNumber: string): Promise<Conversation> {
	const response = await handleApiRequest<{ conversation: any }>(`conversations`, {
		method: 'POST',
		body: {
			type: 'Direct',
			participants: [userStore.user?.mobileNumber, mobileNumber],
		} as any,
	});

	const { conversation } = response;

	return conversation;
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
