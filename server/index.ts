import "./config.ts"
import "./config/db_connect.ts"

import express from "express"
import { createServer } from "http"

import { conversationRoute } from "./routes/ConversationRoute.ts"
import { userRoute } from "./routes/UserRoute.ts"

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/users", userRoute)
app.use("/api/v1/conversations", conversationRoute)

const port = process.env.PORT || 4000

server.listen(port, () => {
  console.log(`Server started at Port:${port}`)
})