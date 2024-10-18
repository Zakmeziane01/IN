const WebSocket = require('ws'); // CommonJS import     This line imports the ws library, It allows you to create WebSocket servers and clients.  
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {                           // Handling Client Connections:  event listener is triggered every time a new client connects to the WebSocket server. The ws parameter represents the client's WebSocket connection.
  console.log('Client connected');
  ws.on('message', (message) => {                        //Handling Incoming Messages: event listener is triggered whenever the server receives a message from the connected client. The message is logged to the console.
    console.log('Received message:', message);
    // Broadcast message to all connected clients, making it a simple chat server.
    wss.clients.forEach((client) => {                       
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {                       //Handling Client Disconnections
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
