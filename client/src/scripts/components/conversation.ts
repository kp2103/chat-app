import { phoneNumber } from '../config/session.js';
import type { Conversation, User } from '../types/types.js';

const convList = document.getElementById('conv-list') as HTMLUListElement;

const getOtherParticipant = (participants: User[]): User => {
	return participants.find((p) => p.mobileNumber !== phoneNumber)!;
};

const formatTime = (timeStr: string): string => {
	const date = timeStr ? new Date(timeStr) : new Date();

	return (
		date.getHours().toString().padStart(2, '0') +
		':' +
		date.getMinutes().toString().padStart(2, '0')
	);
};

function renderConversationCard(conv: Conversation) {
	const isGroup = conv.type === 'Group';

	const displayName =
		isGroup ?
			conv.groupName
		:	`${getOtherParticipant(conv.participants).firstName} ${getOtherParticipant(conv.participants).lastName}`;

	const displayAvatar =
		isGroup ?
			conv.groupAvatarUrl
		:	getOtherParticipant(conv.participants).avatarUrl;

	const listEle = document.createElement('li');
	listEle.classList.add('conv-item');
	listEle.dataset.conversationId = conv.conversationId;

	listEle.innerHTML = `
        <div class="conv-item__avatar">
            <div class="av-wrap">
                <div class="avatar avatar--md">
                    <img src="${displayAvatar}" alt="${displayName}" />
                </div>
                <span class="status-dot status-dot--online"></span>
            </div>
        </div>
        <div class="conv-item__body">
            <div class="conv-item__row">
                <span class="conv-item__name">${displayName}</span>
                <span class="conv-item__time">${formatTime(conv.latestTime)}</span>
            </div>
            <p class="conv-item__preview">${conv.latestMessage || ''}</p>
        </div>
    `;

	convList.appendChild(listEle);
}

function updateConversationPreview(conversationId: string, message: string) {
	const convEle = convList.querySelector(
		`[data-conversation-id="${conversationId}"]`,
	);

	if (!convEle) return;

	const previewEle = convEle.querySelector('.conv-item__preview');
	const timeEle = convEle.querySelector('.conv-item__time');

	if (previewEle) previewEle.textContent = message;
	if (timeEle) timeEle.textContent = formatTime(new Date().toISOString());

	convList.prepend(convEle);
}

export { renderConversationCard, updateConversationPreview };
