import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

interface ServerToClientEvents{
    "receive-message": (message:string)=> void
}

interface ClientToServerEvents{
    "join-room" : (roomId:string)=> void,
    "send-message": (
        data:{
            message:string,
            roomId:string,
            senderMobileNumber:string
        }
    )=>void
}

export function initSocket(httpServer: HTTPServer)
{
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

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