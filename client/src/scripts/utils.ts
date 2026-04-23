import type { Participant } from './conversation.js';

function getPersonName(participants: Participant[], phoneNumber: string) {
	const participant = participants.find(
		(participant) => participant.mobileNumber !== phoneNumber,
	)!;

	return `${participant.firstName} ${participant.lastName}`;
}

function getPersonAvatar(participants: Participant[], phoneNumber: string) {
	const participant = participants.find(
		(participant) => participant.mobileNumber !== phoneNumber,
	)!;

	return participant.avatarURL;
}

export { getPersonAvatar, getPersonName };
