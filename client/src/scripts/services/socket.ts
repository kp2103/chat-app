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
	callback: (response: { isSuccess: boolean; message: string }) => void,
) => {
	if (!socket) return;

	socket.emit('send-message', payload, callback);
};

const onMessageReceived = (callback: (msg: string) => void) => {
	if (!socket) return;

	socket.on('receive-message', (msg: string) => {
		callback(msg);
	});
};

const getSocket = () => socket;

export { emitChatMessage, getSocket, initSocket, joinChatRoom, onMessageReceived };
