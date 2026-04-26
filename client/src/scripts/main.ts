import { fetchConversations, fetchMessages } from './api/chatApi.js';
import { fetchUserProfile } from './api/userApi.js';
import {
	renderConversationCard,
	updateConversationPreview,
} from './components/conversation.js';
import { clearChatBody, renderMessageCard } from './components/message.js';
import { renderOwnProfile, updateChatHeader } from './components/profile.js';
import { phoneNumber } from './config/session.js';
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

async function initApp() {
	initSocket();

	const user = await fetchUserProfile(phoneNumber);
	renderOwnProfile(user);

	const conversations = await fetchConversations(phoneNumber);
	conversations.forEach(renderConversationCard);

	onMessageReceived((msg: string) => {
		if (currentConversationId) {
			renderMessageCard({
				message: msg,
				timeStamp: new Date().toISOString(),
				userMobileNumber: phoneNumber,
				senderMobileNumber: 'incoming',
			});

			updateConversationPreview(currentConversationId, msg);
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
	updateChatHeader({ name, avatarUrl });

	joinChatRoom(convId);

	const messages = await fetchMessages(convId);
	messages.forEach((msg) =>
		renderMessageCard({ ...msg, userMobileNumber: phoneNumber }),
	);
});

async function handleSendMessage() {
	const content = msgInput.value.trim();

	if (!content || !currentConversationId) return;

	const payload = {
		message: content,
		type: 'Text',
		roomId: currentConversationId,
		senderMobileNumber: phoneNumber,
	};

	emitChatMessage(payload, (res) => {
		if (res.isSuccess) {
			renderMessageCard({
				message: content,
				timeStamp: new Date().toISOString(),
				userMobileNumber: phoneNumber,
				senderMobileNumber: phoneNumber,
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
