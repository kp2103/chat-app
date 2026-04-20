import {Server} from 'socket.io'


export function initSocket(httpServer)
{
    const io = new Server(httpServer)

    io.on("connection",(socket)=>{

        console.log("New Socket is Connected with id :",socket.id)

        // listen for join room
        socket.on('join-room',(roomId)=>{ // * roomId = conversationId
            socket.join(roomId)
        })
        
        //listen for send-message
        socket.on('send-message',({message,roomId,senderMobileNumber})=>{
            socket.to(roomId).emit('receive-message',message)

            //save message 
        })
    })
}