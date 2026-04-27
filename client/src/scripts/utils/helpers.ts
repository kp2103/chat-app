import { userStore } from '../config/store.js';
import type { Participant } from '../types/types.js';

const mapParticipant = (p: any) => ({
	firstName: p.firstName,
	lastName: p.lastName,
	mobileNumber: p.mobileNumber,
	avatarUrl: p.avatarURL,
});

const getOtherParticipant = (participants: Participant[]): Participant => {
	return participants.find((p) => p.mobileNumber !== userStore.user?.mobileNumber)!;
};

const formatTime = (timeStr: string): string => {
	const date = timeStr ? new Date(timeStr) : new Date();

	return (
		date.getHours().toString().padStart(2, '0') +
		':' +
		date.getMinutes().toString().padStart(2, '0')
	);
};

export { formatTime, getOtherParticipant, mapParticipant };
