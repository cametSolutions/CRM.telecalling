import { WebSocketServer } from "ws"
let wss

export const createWebSocketServer = (server) => {
  wss = new WebSocketServer({ server })

  wss.on("connection", (ws) => {
    console.log("Client connected")
    ws.send("WebSocket connection established")

    // Handle incoming WebSocket messages from the client
    ws.on("message", (message) => {
      //   console.log("Received WebSocket message:", message)
    })

    // Handle connection close
    ws.on("close", () => {
      console.log("Client disconnected")
    })
  })
}

// Function to broadcast messages to all connected WebSocket clients
export const broadcastMessage = (message) => {
  if (wss) {
    wss.clients.forEach((client) => {
      console.log(`Client state: ${client.readyState}`)
    })
   
  }
}
