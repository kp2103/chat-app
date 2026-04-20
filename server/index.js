import './config.js'
import './config/db_connect.js'

import express from 'express'
import {createServer} from 'http'
import { conversationRoute } from './routes/ConversationRoute.js'
import { userRoute } from './routes/UserRoute.js'

const app = express()

const server = createServer(app)

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/users',userRoute)
app.use('/api/v1/conversations',conversationRoute)
// app.use('//api/v1/messages')

// websocket part



const port = process.env.PORT || 4000
server.listen(port,()=>{
    console.log(`Server started at Port:${port}`)
})


