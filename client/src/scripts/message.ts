const chatBody = document.getElementById('chat-body') as HTMLDivElement;

function createMessageCard({
	message,
	timeStamp,
	userMobileNumber,
	senderMobileNumber,
}: {
	message: string;
	timeStamp: string;
	userMobileNumber: string;
	senderMobileNumber?: string;
}) {
	const messageEle = document.createElement('p');
	messageEle.classList.add('chat-message');

	senderMobileNumber === userMobileNumber &&
		messageEle.classList.add('chat-message--sent');

	const messageSpan = document.createElement('span');
	messageSpan.classList.add('message');
	messageSpan.textContent = message;

	const timeSpan = document.createElement('span');
	timeSpan.classList.add('message-time');

	const date: Date = timeStamp ? new Date(timeStamp) : new Date();

	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	timeSpan.textContent = `${hours}:${minutes}`;

	messageEle.appendChild(messageSpan);
	messageEle.appendChild(timeSpan);

	chatBody.prepend(messageEle);
}

export { createMessageCard };
