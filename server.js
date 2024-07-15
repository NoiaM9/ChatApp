const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');  // Add this line

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

app.use(bodyParser.json());
app.use(cors());  // cors to show us the details of the request

let messages = [];

app.post('/message', (req, res) => {
    const message = req.body.message;
    messages.push(message);

    // Broadcast the new message to all connected clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message }));
        }
    });

    res.send({ message: "Message received" });
});

app.get('/messages', (req, res) => {
    res.send(messages);
});

wss.on('connection', ws => {
    console.log('Client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});