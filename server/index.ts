import './config.ts';
import './config/db_connect.ts';

import express from 'express';
import { createServer } from 'http';

import cors from 'cors';

import { conversationRoute } from './routes/ConversationRoute.ts';
import { messageRoute } from './routes/MessageRoute.ts';
import { userRoute } from './routes/UserRoute.ts';
import { initSocket } from './socket.ts';

const app = express();
const server = createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/conversations', conversationRoute);
app.use('/api/v1/messages', messageRoute);

initSocket(server);

const port = process.env.PORT || 4000;

server.listen(port, () => {
	console.log(`Server started at Port:${port}`);
});
