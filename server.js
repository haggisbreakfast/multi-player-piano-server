const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));

// Create the WebSockets server
const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // receiving messages from client
  ws.onmessage = function(event) {
    let incomingNote = JSON.parse(event.data);
    let outgoingNote = {
      note: incomingNote.note,
    };

    // broadcast note to all connected users
    wss.clients.forEach(function each(client) {
      let noteToSend = JSON.stringify(outgoingNote);
      console.log('sending note');
      client.send(noteToSend);
    });
  };
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
