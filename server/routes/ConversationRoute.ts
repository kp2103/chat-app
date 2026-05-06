import { Router } from 'express';
import { createConversation } from '../controller/Conversations/createConversationController.ts';
import { fetchConversationForUser } from '../controller/Conversations/fetchConversationForUser.ts';

const conversationRoute = Router()

// route for create conversation
conversationRoute.route('/').post(createConversation)

// route for get all conversation
// conversationRoute.route('/').get()

// route for get specfic user conversation
conversationRoute.route('/:mobileNumber').get(fetchConversationForUser)

// route for update the route
// conversationRoute.route('/:id').patch()

// route for delete the route
// conversationRoute.route('/:id').delete()

export { conversationRoute };
