import { renderConversationCard } from '../components/conversation.js';
import { userStore } from '../config/store.js';

interface Filters {
	conversation: {
		search: string;
		tags: string[];
	};
}

const conversationSearch = document.getElementById(
	'conversation-search',
) as HTMLInputElement;

const filters: Filters = {
	conversation: {
		search: '',
		tags: [],
	},
};

function changeConversationSearchFilter(key: 'search', value: string) {
	filters['conversation'][key] = value;

	updateFilters();
}

function updateFilters() {
	const convList = document.getElementById('conv-list') as HTMLUListElement;

	convList.innerHTML = '';

	const conversations = userStore.conversations!.filter((conv) => {
		return (
			conv.latestMessage &&
			(!filters.conversation.search ||
				conv.participants.some((participant) => {
					return (
						participant.mobileNumber.includes(filters.conversation.search) ||
						`${participant.firstName} ${participant.lastName}`
							.toLowerCase()
							.includes(filters.conversation.search)
					);
				}))
		);
	});

	conversations
		.toSorted((a, b) => {
			const timeA = new Date(a.latestTime).getTime();
			const timeB = new Date(b.latestTime).getTime();

			return timeB - timeA;
		})
		.forEach(renderConversationCard);
}

conversationSearch.addEventListener('input', () =>
	changeConversationSearchFilter('search', conversationSearch.value.toLowerCase()),
);

export { updateFilters };
