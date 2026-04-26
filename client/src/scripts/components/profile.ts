import type { User } from '../types/types.js';

const ownProfileContainer = document.getElementById(
	'own-profile-container',
) as HTMLDivElement;
const navUserImg = document.getElementById('user-nav-img') as HTMLImageElement;

const chatHeaderImg = document.getElementById('chat-header-img') as HTMLImageElement;
const chatTitle = document.getElementById('chat-title') as HTMLParagraphElement;
const chatSubtitle = document.getElementById(
	'chat-subtitle',
) as HTMLParagraphElement;

function renderOwnProfile(user: User) {
	const fullName = `${user.firstName} ${user.lastName}`;

	if (navUserImg) {
		navUserImg.src = user.avatarUrl;
		navUserImg.alt = fullName;
	}

	if (ownProfileContainer) {
		ownProfileContainer.innerHTML = `
            <div class="av-wrap">
                <div class="avatar avatar--lg">
                    <img src="${user.avatarUrl}" alt="${fullName}" />
                </div>
            </div>
            <p class="own-profile__name">${fullName}</p>
        `;
	}
}

function updateChatHeader(details: {
	name: string;
	avatarUrl: string;
	isGroup?: boolean;
}) {
	if (chatHeaderImg) {
		chatHeaderImg.src = details.avatarUrl;
		chatHeaderImg.alt = details.name;
	}

	if (chatTitle) {
		chatTitle.textContent = details.name;
	}

	if (chatSubtitle) {
		chatSubtitle.textContent = details.isGroup ? 'Group Chat' : 'Online';
	}
}

export { renderOwnProfile, updateChatHeader };
