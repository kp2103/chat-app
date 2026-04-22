import { phoneNumber } from './setVariable.js';

const sendBtn = document.getElementById('btn-send') as HTMLButtonElement;
const inputMessage = document.getElementById('msg-input') as HTMLInputElement;
const chatBody = document.getElementById('chat-body') as HTMLDivElement;

declare const io: any;

const socket = io(`http://localhost:4000`, {
	transports: ['websocket'],
});

socket.emit('join-room', '50d90482-2b55-4dc3-ba74-35b4e7a81117');

socket.on('receive-message', (msg: string) => {
	if (msg) {
		const messageEle = document.createElement('p');
		messageEle.classList.add('chat-message');

		const messageSpan = document.createElement('span');
		messageSpan.classList.add('message');
		messageSpan.textContent = msg;

		const timeSpan = document.createElement('span');
		timeSpan.classList.add('message-time');

		const date: Date = new Date();

		const hours = date.getHours();
		const minutes = date.getMinutes();
		timeSpan.textContent = `${hours}:${minutes}`;

		messageEle.appendChild(messageSpan);
		messageEle.appendChild(timeSpan);

		chatBody.append(messageEle);
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
				const messageEle = document.createElement('p');
				messageEle.classList.add('chat-message', 'chat-message--sent');

				const messageSpan = document.createElement('span');
				messageSpan.classList.add('message');
				messageSpan.textContent = inputMessage.value;

				const timeSpan = document.createElement('span');
				timeSpan.classList.add('message-time');

				const date: Date = new Date();

				const hours = date.getHours();
				const minutes = date.getMinutes();
				timeSpan.textContent = `${hours}:${minutes}`;

				messageEle.appendChild(messageSpan);
				messageEle.appendChild(timeSpan);

				chatBody.append(messageEle);
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
		const messageEle = document.createElement('p');
		messageEle.classList.add('chat-message');

		message.senderMobileNumber === phoneNumber &&
			messageEle.classList.add('chat-message--sent');

		const messageSpan = document.createElement('span');
		messageSpan.classList.add('message');
		messageSpan.textContent = message.content.text;

		const timeSpan = document.createElement('span');
		timeSpan.classList.add('message-time');

		const date: Date = new Date();

		const hours = date.getHours();
		const minutes = date.getMinutes();
		timeSpan.textContent = `${hours}:${minutes}`;

		messageEle.appendChild(messageSpan);
		messageEle.appendChild(timeSpan);

		chatBody.append(messageEle);
	}
}
loadMessages('50d90482-2b55-4dc3-ba74-35b4e7a81117');
