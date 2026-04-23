import { createMessageCard } from './message.js';
import { socket } from './script.js';
import { phoneNumber } from './setVariable.js';
import { getPersonAvatar, getPersonName } from './utils.js';

interface Participant {
	mobileNumber: string;
	firstName: string;
	lastName: string;
	avatarURL: string;
}

const convList = document.getElementById('conv-list') as HTMLUListElement;
const chatArea = document.getElementById('chat-panel') as HTMLDivElement;
const chatBody = document.getElementById('chat-body') as HTMLDivElement;
const inputMessage = document.getElementById('msg-input') as HTMLInputElement;
const sendBtn = document.getElementById('btn-send') as HTMLButtonElement;
const chatHeaderImageEle = document.querySelector(
	'.chat-header__info img',
) as HTMLImageElement;
const chatTitle = document.getElementById('chat-title') as HTMLPreElement;

let currentConversationId: null | string = null;

chatArea.style.display = 'none';

convList.addEventListener('click', (e) => {
	const target = e.target as HTMLElement | null;
	const convItemEle = target?.closest('.conv-item') as HTMLLIElement | null;

	if (!convItemEle) return;

	chatBody.innerHTML = '';

	currentConversationId = convItemEle.dataset.conversationId!;

	socket.emit('join-room', currentConversationId);

	chatArea.style.display = 'flex';

	loadMessages(currentConversationId);

	const avatarUrl = convItemEle.querySelector('img')!.src;
	const name = convItemEle.querySelector('.conv-item__name')!.textContent;

	updateChatHeader({ avatarUrl, name });
});

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

async function sendMessage(e: PointerEvent) {
	if (!currentConversationId) return;

	const messageObj = {
		message: inputMessage.value,
		type: 'Text',
		roomId: currentConversationId,
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

				inputMessage.value = '';
			}
		},
	);
}

sendBtn.addEventListener('click', (e) => sendMessage(e));

function createAvatarElement({ participants }: { participants: Participant[] }) {
	const convItemAvatarEle = document.createElement('div');
	convItemAvatarEle.classList.add('conv-item__avatar');

	const avatarWrapperEle = document.createElement('div');
	avatarWrapperEle.classList.add('av-wrap');

	const avatarEle = document.createElement('div');
	avatarEle.classList.add('avatar', 'avatar--md');

	const avatarImageEle = document.createElement('img');

	avatarImageEle.src = getPersonAvatar(participants, phoneNumber);
	avatarImageEle.alt = getPersonName(participants, phoneNumber);

	avatarEle.appendChild(avatarImageEle);

	const statusEle = document.createElement('span');
	statusEle.classList.add('status-dot', 'status-dot--online');

	avatarWrapperEle.appendChild(avatarEle);
	avatarWrapperEle.appendChild(statusEle);

	convItemAvatarEle.appendChild(avatarWrapperEle);

	return convItemAvatarEle;
}

function createBodyElement({
	latestMessage,
	latestTime,
	participants,
}: {
	latestMessage: string;
	latestTime: string;
	participants: Participant[];
}) {
	const convItemBodyEle = document.createElement('div');
	convItemBodyEle.classList.add('conv-item__body');

	const convItemRowEle = document.createElement('div');
	convItemRowEle.classList.add('conv-item__row');

	const convItemNameEle = document.createElement('span');
	convItemNameEle.classList.add('conv-item__name');
	convItemNameEle.textContent = getPersonName(participants, phoneNumber);

	convItemRowEle.appendChild(convItemNameEle);

	if (latestTime) {
		const convItemTimeEle = document.createElement('span');
		convItemTimeEle.classList.add('conv-item__time');

		const date: Date = new Date(latestTime);

		const hours = date.getHours();
		const minutes = date.getMinutes();
		convItemTimeEle.textContent = `${hours}:${minutes}`;

		convItemRowEle.appendChild(convItemTimeEle);
	}

	const convItemPreviewEle = document.createElement('p');
	convItemPreviewEle.classList.add('conv-item__preview');
	convItemPreviewEle.textContent = latestMessage;

	convItemBodyEle.appendChild(convItemRowEle);
	convItemBodyEle.appendChild(convItemPreviewEle);

	return convItemBodyEle;
}

function createConversationCard({
	conversationId,
	latestMessage,
	latestTime,
	participants,
}: {
	conversationId: string;
	latestMessage: string;
	latestTime: string;
	participants: Participant[];
}) {
	const listEle = document.createElement('li');
	listEle.classList.add('conv-item');
	listEle.dataset.conversationId = conversationId;

	const convItemAvatarEle = createAvatarElement({ participants });

	const convItemBodyEle = createBodyElement({
		latestMessage,
		latestTime,
		participants,
	});

	listEle.appendChild(convItemAvatarEle);
	listEle.appendChild(convItemBodyEle);

	convList.appendChild(listEle);
}

function updateChatHeader({ avatarUrl, name }: { avatarUrl: string; name: string }) {
	chatHeaderImageEle.src = avatarUrl;
	chatHeaderImageEle.alt = name;

	chatTitle.textContent = name;
}

export { type Participant, createConversationCard };
