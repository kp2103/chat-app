import { createConversationCard } from './conversation.js';
import { phoneNumber } from './setVariable.js';
import { createUserProfile } from './user.js';

async function loadConversation(mobileNumber: string) {
	const res = await fetch(
		`http://localhost:4000/api/v1/conversations/${mobileNumber}`,
		{
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
			},
		},
	);

	const resObj = await res.json();

	console.log(resObj);
	
	const conversations = await resObj.conversations;

	for (const conversation of conversations) {
		createConversationCard({
			type: conversation.type,
			name: conversation.name,
			groupAvatarUrl: conversation.groupAvatarURL,
			conversationId: conversation.conversationId,
			latestMessage: conversation.latestMessage,
			latestTime: conversation.latestTime,
			participants: conversation.participants,
		});
	}
}
loadConversation(phoneNumber);

async function loadUser(mobileNumber: string) {
	const res = await fetch(`http://localhost:4000/api/v1/users/${mobileNumber}`, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
		},
	});

	const resObj = await res.json();

	console.log(resObj);

	const user = await resObj.user;

	createUserProfile({
		firstName: user.firstName,
		lastName: user.lastName,
		avatarUrl: user.avatarURL,
	});
}
loadUser(phoneNumber);
