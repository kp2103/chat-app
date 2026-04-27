import { fetchConversations, fetchMessages } from './api/chatApi.js';
import { fetchUserProfile } from './api/userApi.js';
import {
	renderConversationCard,
	updateConversationPreview,
} from './components/conversation.js';
import { clearChatBody, renderMessageCard } from './components/message.js';
import { renderOwnProfile, updateChatHeader } from './components/profile.js';
import { phoneNumber } from './config/session.js';
import { userStore } from './config/store.js';
import {
	emitChatMessage,
	initSocket,
	joinChatRoom,
	onMessageReceived,
} from './services/socket.js';

const convList = document.getElementById('conv-list') as HTMLUListElement;
const chatPanel = document.getElementById('chat-panel') as HTMLElement;
const msgInput = document.getElementById('msg-input') as HTMLInputElement;
const sendBtn = document.getElementById('btn-send') as HTMLButtonElement;

let currentConversationId: string | null = null;
const convItems = document.getElementsByClassName('conv-item');

async function initApp() {
	initSocket();

	userStore.user = await fetchUserProfile(phoneNumber);
	renderOwnProfile(userStore.user);

	userStore.conversations = await fetchConversations(userStore.user?.mobileNumber);
	userStore.conversations.forEach(renderConversationCard);

	onMessageReceived((data: { message: string; senderMobileNumber: string }) => {
		if (currentConversationId) {
			renderMessageCard({
				message: data.message,
				timeStamp: new Date().toISOString(),
				userMobileNumber: userStore.user!.mobileNumber,
				senderMobileNumber: data.senderMobileNumber,
			});

			updateConversationPreview(currentConversationId, data.message);
		}
	});
}

convList.addEventListener('click', async (e) => {
	const target = e.target as HTMLElement;
	const convItem = target.closest('.conv-item') as HTMLLIElement;

	if (!convItem) return;

	const convId = convItem.dataset.conversationId!;
	currentConversationId = convId;

	clearChatBody();
	chatPanel.style.display = 'flex';

	const avatarUrl = convItem.querySelector('img')!.src;
	const name = convItem.querySelector('.conv-item__name')!.textContent!;

	[...convItems].forEach((item) => item.classList.remove('conv-item--selected'));

	convItem.classList.add('conv-item--selected');

	updateChatHeader({ name, avatarUrl, type: convItem.dataset.type! });

	joinChatRoom(convId);

	const messages = await fetchMessages(convId);
	messages.forEach((msg) =>
		renderMessageCard({ ...msg, userMobileNumber: userStore.user!.mobileNumber }),
	);
});

async function handleSendMessage() {
	const content = msgInput.value.trim();

	if (!content || !currentConversationId) return;

	const payload = {
		message: content,
		type: 'Text',
		roomId: currentConversationId,
		senderMobileNumber: userStore.user!.mobileNumber,
	};

	emitChatMessage(payload, (res) => {
		if (res.isSuccess) {
			renderMessageCard({
				message: content,
				timeStamp: new Date().toISOString(),
				userMobileNumber: userStore.user!.mobileNumber,
				senderMobileNumber: userStore.user!.mobileNumber,
			});

			updateConversationPreview(currentConversationId!, content);

			msgInput.value = '';
		}
	});
}

sendBtn.addEventListener('click', handleSendMessage);
msgInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') handleSendMessage();
});

initApp();
