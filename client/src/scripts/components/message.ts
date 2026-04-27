import { phoneNumber } from '../config/session.js';
import type { Message } from '../types/types.js';
import { formatTime } from '../utils/helpers.js';

const chatBody = document.getElementById('chat-body') as HTMLDivElement;

function renderMessageCard(msg: Message) {
	const messageEle = document.createElement('p');
	messageEle.classList.add('chat-message');

	if (msg.senderMobileNumber === phoneNumber) {
		messageEle.classList.add('chat-message--sent');
	}

	messageEle.innerHTML = `
        <span class="message">${msg.message}</span>
        <span class="message-time">${formatTime(msg.timeStamp)}</span>
    `;

	chatBody.prepend(messageEle);
}

function clearChatBody() {
	chatBody.innerHTML = '';
}

export { clearChatBody, renderMessageCard };
