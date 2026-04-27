import type { SocketMessagePayload } from '../types/types.js';

declare const io: any;

let socket: any;

const initSocket = () => {
	socket = io(`http://localhost:4000`, {
		transports: ['websocket'],
	});

	socket.on('connect', () => {
		console.log('Connected to socket server');
	});

	return socket;
};

const joinChatRoom = (roomId: string) => {
	if (!socket) return;

	socket.emit('join-room', roomId);
};

const emitChatMessage = (
	payload: SocketMessagePayload,
	callback: (response: {
		isSuccess: boolean;
		message: string;
		messageId: string;
	}) => void,
) => {
	if (!socket) return;

	socket.emit('send-message', payload, callback);
};

const onMessageReceived = (
	callback: (data: {
		message: string;
		senderMobileNumber: string;
		messageId: string;
	}) => void,
) => {
	if (!socket) return;

	socket.on(
		'receive-message',
		(data: { message: string; senderMobileNumber: string; messageId: string }) => {
			callback(data);
		},
	);
};

const getSocket = () => socket;

export { emitChatMessage, getSocket, initSocket, joinChatRoom, onMessageReceived };
