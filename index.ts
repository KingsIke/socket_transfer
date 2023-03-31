import express from 'express';
import { Server, Socket } from 'socket.io'
import path from 'path';
import http from "http";



// console.log('Hello')

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function (socket: Socket) {
    socket.on("sender-join", function (data: { uid: string }) {
        socket.join(data.uid);
    });

    socket.on("receiver-join", function (data: { uid: string, sender_uid: string }) {
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init", data.uid);
    });

    socket.on("file-meta", function (data: { uid: string, metadata: { filename: string, total_buffer_size: number, buffer_size: number } }) {
        socket.in(data.uid).emit("fs-meta", data.metadata);
    });

    socket.on("fs-start", function (data: { uid: string }) {
        socket.in(data.uid).emit("fs-share", {});
    });

    socket.on("file-raw", function (data: { uid: string, buffer: Uint8Array }) {
        socket.in(data.uid).emit("fs-share", data.buffer);
    });
});

server.listen(5700, () => {
    console.log('Server connected @ 5700')
});