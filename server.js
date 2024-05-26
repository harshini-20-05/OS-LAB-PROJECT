const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Event listener for when a client connects
wss.on("connection", function connection(ws) {
  console.log("Client connected");

  // Event listener for when the server receives a message from a client
  ws.on("message", function incoming(message) {
    console.log("Received message:", message);

    // Convert received buffer to string
    const receivedMessage = Buffer.from(message).toString("utf-8");
    console.log("message:", receivedMessage);

    // Broadcast the received message to all connected clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(receivedMessage);
      }
    });
  });
});
