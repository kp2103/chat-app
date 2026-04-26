import { phoneNumber } from '../config/session.js';
import type { Message } from '../types/types.js';

const chatBody = document.getElementById('chat-body') as HTMLDivElement;

const formatMessageTime = (timeStamp: string): string => {
	const date = timeStamp ? new Date(timeStamp) : new Date();
	return (
		date.getHours().toString().padStart(2, '0') +
		':' +
		date.getMinutes().toString().padStart(2, '0')
	);
};

function renderMessageCard(msg: Message) {
	const messageEle = document.createElement('p');
	messageEle.classList.add('chat-message');

	if (msg.senderMobileNumber === phoneNumber) {
		messageEle.classList.add('chat-message--sent');
	}

	messageEle.innerHTML = `
        <span class="message">${msg.message}</span>
        <span class="message-time">${formatMessageTime(msg.timeStamp)}</span>
    `;

	chatBody.prepend(messageEle);
}

function clearChatBody() {
	chatBody.innerHTML = '';
}

export { clearChatBody, renderMessageCard };
