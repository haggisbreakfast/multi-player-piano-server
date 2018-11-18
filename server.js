const express = require('express');
const SocketServer = require('ws').Server;
// const uuidv4 = require('uuid/v4');
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () =>
    console.log(`Listening on ${PORT}`),
  );

// Create the WebSockets server
const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  // set up user count on connection
  let clientCountObject = {
    type: 'userCount',
    count: wss.clients.size,
  };
  // loop through each connected client and send object to app
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(clientCountObject));
  });
  ws.onmessage = function(event) {
    const parsedData = JSON.parse(event.data);
    const keysData = JSON.stringify({
      ...parsedData,
      count: clientCountObject.count,
    });
    // broadcast received data to all connected users
    wss.clients.forEach(function each(client) {
      client.send(keysData);
      console.log(JSON.stringify(parsedData));
    });
  };

  ws.on('close', () => {
    console.log('Client disconnected');
    // reassign user count when client disconnects
    clientCountObject.count = wss.clients.size;
    // loop through clients and send new client count data
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(clientCountObject));
    });
  });
});
