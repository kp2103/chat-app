import type { User } from '../types/types.js';
import { client } from './client.js';

async function fetchUserProfile(mobileNumber: string): Promise<User> {
	const response = await client<{ user: any }>(`users/${mobileNumber}`);
	const { user } = response;

	return {
		mobileNumber: user.mobileNumber,
		firstName: user.firstName,
		lastName: user.lastName,
		avatarUrl: user.avatarURL,
	};
}

export { fetchUserProfile };
