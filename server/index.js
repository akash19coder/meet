import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: true
});

io.on("connection", (socket) => {
   socket.on("room:joined", (data)=> {
    console.log(data.roomId.id);
    io.to(data.roomId.id).emit("new:joinee", 'i am ben 10');
    socket.join(data);
   })
});

httpServer.listen(3000, () => {
    console.log('Signaling Server running at localhost:3000');
});