interface User {
	firstName: string;
	lastName: string;
	avatarUrl: string;
}

const ownProfile = document.querySelector('.own-profile') as HTMLDivElement;

function createUserProfile({ firstName, lastName, avatarUrl }: User) {
	const userAvatarWrapperEle = document.createElement('div');
	userAvatarWrapperEle.classList.add('av-wrap');

	const userAvatarEle = document.createElement('div');
	userAvatarEle.classList.add('avatar', 'avatar--lg');

	const userAvatarImageEle = document.createElement('img');

	userAvatarImageEle.src = avatarUrl;
	userAvatarImageEle.alt = `${firstName} ${lastName}`;

	userAvatarEle.appendChild(userAvatarImageEle);

	userAvatarWrapperEle.appendChild(userAvatarEle);

	const userNameEle = document.createElement('p');
	userNameEle.classList.add('own-profile__name');
	userNameEle.textContent = `${firstName} ${lastName}`;

	ownProfile.appendChild(userAvatarWrapperEle);
	ownProfile.appendChild(userNameEle);
}

export { createUserProfile };
