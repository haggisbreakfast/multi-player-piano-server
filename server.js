const express = require('express');
const SocketServer = require('ws').Server;
// const uuidv4 = require('uuid/v4');
const PORT = process.env.PORT || 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// Create the WebSockets server
const wss = new SocketServer({ server });
// const recording = {
// isRecording: false,
// getNote() {},
// toggleRecording() {
//   console.log('Toggle');
//   if (!this.isRecording) {
//     this.startTime = new Date();
//     this.notes = [];
//     this.getNote = function(note, time) {
//       // setImmediate(() => {
//       this.notes.push({ note, offset: time - this.startTime });
//       console.log(this.notes);
// });
//   };
//   this.isRecording = true;
// } else {
//   console.log('yer dun');
//   console.log(this.notes);

//     wss.clients.forEach((client) => {
//       client.send(JSON.stringify({ type: 'recorded', notes: this.notes }));
//       // client.send('a string');
//     });
//     console.log('sent 2 all');

//     this.notes = [];
//     this.getNote = function() {};
//     this.isRecording = false;
//   }
// },
// };
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
    // if (parsedData.type === 'recording') {
    //   recording.toggleRecording();

    //   return;
    // }
    const keysData = JSON.stringify({
      ...parsedData,
      count: wss.clients.size,
    });
    // recording.getNote(keysData, new Date());
    // broadcast received data to all connected users
    wss.clients.forEach(function each(client) {
      if (client !== ws && parsedData.type === 'note') {
        client.send(keysData);
      } else {
        client.send(keysData);
      }

      // setImmediate(() => {
      //   console.log(JSON.stringify(parsedData));
      // });
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
