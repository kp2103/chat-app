import {Router} from 'express'
import {createConversation} from '../controller/Conversations/createConversationController.js'

const conversationRoute = Router()

// route for create conversation
conversationRoute.route('/').post(createConversation)

// route for get all conversation
// conversationRoute.route('/').get()

// route for get specfic conversation
// conversationRoute.route('/:id').get()

// route for update the route
// conversationRoute.route('/:id').patch()

// route for delete the route
// conversationRoute.route('/:id').delete()

export { conversationRoute}
