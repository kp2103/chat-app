import type { User } from '../types/types.js';
import { handleApiRequest } from './client.js';

async function fetchUserProfile(mobileNumber: string): Promise<User> {
	const response = await handleApiRequest<{ user: any }>(`users/${mobileNumber}`);
	const { user } = response;

	return {
		mobileNumber: user.mobileNumber,
		firstName: user.firstName,
		lastName: user.lastName,
		avatarUrl: user.avatarURL,
	};
}

export { fetchUserProfile };
