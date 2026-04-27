import type { Conversation, User } from '../types/types.js';

interface UserStore {
	user: User | null;
	conversations: Conversation[] | null;
}

const userStore: UserStore = {
	user: null,
	conversations: null,
};

export { userStore };
