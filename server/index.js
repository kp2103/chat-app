import './config.js'
import './config/db_connect.js'

import express from 'express'
import {createServer} from 'http'

const app = express()

const server = createServer(app)


// websocket part

const port = process.env.PORT
server.listen(port,()=>{
    console.log(`Server started at Port:${port}`)
})


// kp4221111_db_user

// Simformkrishhimanshu

