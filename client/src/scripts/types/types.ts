interface User {
	firstName: string;
	lastName: string;
	avatarUrl: string;
	mobileNumber: string;
}

interface Participant extends User {}

interface BaseConversation {
	conversationId: string;
	latestMessage: string;
	latestTime: string;
	participants: Participant[];
}

interface DirectConversation extends BaseConversation {
	type: 'Direct';
}

interface GroupConversation extends BaseConversation {
	type: 'Group';
	groupName: string;
	groupAvatarUrl: string;
}

type Conversation = DirectConversation | GroupConversation;

interface Message {
	messageId: string;
	message: string;
	timeStamp: string;
	userMobileNumber: string;
	senderMobileNumber: string;
}

interface SocketMessagePayload {
	message: string;
	type: string;
	roomId: string;
	senderMobileNumber: string;
}

export type {
	Conversation,
	DirectConversation,
	GroupConversation,
	Message,
	Participant,
	SocketMessagePayload,
	User,
};
