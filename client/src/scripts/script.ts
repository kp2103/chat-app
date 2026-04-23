import { createConversationCard } from './conversation.js';
import { createMessageCard } from './message.js';
import { phoneNumber } from './setVariable.js';
import { createUserProfile } from './user.js';

const sendBtn = document.getElementById('btn-send') as HTMLButtonElement;
const inputMessage = document.getElementById('msg-input') as HTMLInputElement;

declare const io: any;

const socket = io(`http://localhost:4000`, {
	transports: ['websocket'],
});

socket.emit('join-room', '50d90482-2b55-4dc3-ba74-35b4e7a81117');

socket.on('receive-message', (msg: string) => {
	if (msg) {
		createMessageCard({
			message: msg,
			timeStamp: new Date().toString(),
			userMobileNumber: phoneNumber,
		});
	}
});

sendBtn.addEventListener('click', (e) => sendMessage(e));

async function sendMessage(e: PointerEvent) {
	const messageObj = {
		message: inputMessage.value,
		type: 'Text',
		roomId: '50d90482-2b55-4dc3-ba74-35b4e7a81117',
		senderMobileNumber: phoneNumber,
	};

	socket.emit(
		'send-message',
		messageObj,
		(obj: { status: number; isSuccess: boolean; message: string }) => {
			if (obj.isSuccess) {
				createMessageCard({
					message: inputMessage.value,
					timeStamp: new Date().toString(),
					userMobileNumber: phoneNumber,
					senderMobileNumber: phoneNumber,
				});
			}
		},
	);
}

async function loadMessages(roomId: string) {
	const res = await fetch(`http://localhost:4000/api/v1/messages/${roomId}`, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
		},
	});

	const resObj = await res.json();
	const messages = await resObj.messages;

	for (const message of messages) {
		createMessageCard({
			message: message.content.text,
			timeStamp: message.createdAt,
			senderMobileNumber: message.senderMobileNumber,
			userMobileNumber: phoneNumber,
		});
	}
}
loadMessages('50d90482-2b55-4dc3-ba74-35b4e7a81117');

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
	const conversations = await resObj.conversations;

	for (const conversation of conversations) {
		createConversationCard({
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
	const user = await resObj.user;

	createUserProfile({
		firstName: user.firstName,
		lastName: user.lastName,
		avatarUrl: user.avatarURL,
	});
}
loadUser(phoneNumber);
