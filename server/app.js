import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (_req, res) => {
    const indexPath = path.join(__dirname, '/views/index.html');
    res.sendFile(indexPath);
});


const messageHistory = [];

io.on('connection', (socket) => {
    console.log('user connected');

    socket.emit('message history', messageHistory);

    socket.on('chat message', (msg) => {
        messageHistory.push(msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('typing', (username) => {
        socket.broadcast.emit('user typing', username);
      });
      socket.on('stop typing', (username) => {
        socket.broadcast.emit('user stop typing', username);
      });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});