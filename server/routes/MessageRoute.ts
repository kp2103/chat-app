import express from 'express';
import { createMessageController } from '../controller/Message/createMessageController.ts';
import { fetchAllMessagesForSpecificUserController } from '../controller/Message/fetchAllMessagesForSpecificUser.ts';

const messageRoute = express.Router();

messageRoute.route('/').post(createMessageController);
messageRoute.route('/:conversationId').get(fetchAllMessagesForSpecificUserController);

export { messageRoute };
