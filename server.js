const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

const { createProxyMiddleware } = require('http-proxy-middleware');


io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('chatMessage', async (msg) => {
        const isSafe = await moderateMessage(msg.text);

        if (isSafe) {
            io.emit('chatMessage', msg);
        } else {
            socket.emit('chatMessage', {
                user: 'Moderator',
                text: 'Your message violated community guidelines and was blocked.'
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

async function moderateMessage(text) {
    try {
        const response = await axios.post('http://localhost:5000/detect', {
            message: text
        });
        return !response.data.is_abusive;
    } catch (error) {
        console.error("Error moderating message:", error);
        return true;
    }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open the application at: http://localhost:${PORT}`);
});
