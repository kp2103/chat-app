import { phoneNumber } from './setVariable.js';
import { getPersonAvatar, getPersonName } from './utils.js';

interface Participant {
	mobileNumber: string;
	firstName: string;
	lastName: string;
	avatarURL: string;
}

const convList = document.getElementById('conv-list') as HTMLUListElement;

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

export { type Participant, createConversationCard };
