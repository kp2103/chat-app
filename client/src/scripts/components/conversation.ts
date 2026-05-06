import { userStore } from '../config/store.js';
import type { Conversation } from '../types/types.js';
import { formatTime, getOtherParticipant } from '../utils/helpers.js';

const convList = document.getElementById('conv-list') as HTMLUListElement;

function renderConversationCard(conv: Conversation) {
	const isGroup = conv.type === 'Group';

	const displayName =
		isGroup ?
			conv.groupName
		:	`${getOtherParticipant(conv.participants).firstName} ${getOtherParticipant(conv.participants).lastName}`;

	const displayAvatar =
		isGroup ? conv.groupAvatarUrl : getOtherParticipant(conv.participants).avatarUrl;

	const listEle = document.createElement('li');
	listEle.classList.add('conv-item');
	listEle.dataset.conversationId = conv.conversationId;
	listEle.dataset.type = conv.type;

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
            <p class="conv-item__preview">${conv.senderMobileNumber === userStore.user?.mobileNumber ? 'You' : displayName} : ${conv.latestMessage || ''}</p>
        </div>
    `;

	convList.appendChild(listEle);
}

function updateConversationPreview(
	conversationId: string,
	message: string,
	senderMobileNumber: string,
) {
	const convEle = convList.querySelector(`[data-conversation-id="${conversationId}"]`);

	if (!convEle) return;

	const previewEle = convEle.querySelector('.conv-item__preview');
	const timeEle = convEle.querySelector('.conv-item__time');

	if (previewEle)
		previewEle.textContent = `${senderMobileNumber === userStore.user?.mobileNumber ? 'You' : ''} : ${message}`;
	if (timeEle) timeEle.textContent = formatTime(new Date().toISOString());

	convList.prepend(convEle);
}

export { renderConversationCard, updateConversationPreview };
