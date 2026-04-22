import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { createMessage } from "./services/createMessage.service.ts";

interface ServerToClientEvents{
    "receive-message": (message:string)=> void
}

interface ClientToServerEvents{
    "join-room" : (roomId:string)=> void,
    "send-message": (
        data:{
            message:string,
            roomId:string,
            senderMobileNumber:string,
            type:string
        },        
        callback:(arg: {
            message:string,
            status:number,
            isSuccess: boolean
        })=>any
    )=>void
}

export function initSocket(httpServer: HTTPServer)
{
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

    io.on("connection",(socket)=>{

        console.log("New Socket is Connected with id :",socket.id)

        // listen for join room
        socket.on('join-room',(roomId)=>{ // * roomId = conversationId
            if(roomId)
                socket.join(roomId)
        })
        
        //listen for send-message
        socket.on('send-message',({message,type,roomId,senderMobileNumber},callback)=>{
            //save message roomId = conversationId
            const response = createMessage(roomId,type,senderMobileNumber,message)
            
            response.then((res)=>{
                callback({
                    status:res.status,
                    message:res.message,
                    isSuccess:res.isSuccess
                })
            })

            socket.to(roomId).emit('receive-message',message)
        })
    })
}

// socket.emit("send_message", data, (ack) => {
//   if (ack.status === "ok") {
//     console.log("Saved + delivered");
//   } else {
//     retry();
//   }
// });