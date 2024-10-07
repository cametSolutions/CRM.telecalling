import { WebSocketServer } from "ws"
let wss

export const createWebSocketServer = (server) => {
  console.log("serversssssss", server)
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
  console.log("new message", message)
  if (wss) {
    console.log("message undoooo")
    console.log("clientws", wss.clients)
    wss.clients.forEach((client) => {
      console.log(`Client state: ${client.readyState}`)
    })
    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocketServer.OPEN) {
    //     console.log("messsagesffddfdfd", message)
    //     client.send(message)
    //   } else {
    //     console.log("errrrrrrrundallooooo")
    //   }
    // })
  }
}