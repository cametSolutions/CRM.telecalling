import React, { useEffect, useState } from "react"

const WebSocketClient = () => {
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Create a WebSocket connection
    const ws = new WebSocket("ws://localhost:9000") // Update with your server's URL
    console.log("wsssss", ws)
    // Listen for messages from the server
    ws.onmessage = (event) => {
      console.log("transmitted")
      const receivedMessage = event.data
      console.log("Received message:", receivedMessage)
      setMessage(receivedMessage) // Update the message state
    }

    // Handle connection open
    ws.onopen = () => {
      console.log("WebSocket connection established")
    }
    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    // Handle connection close
    ws.onclose = () => {
      console.log("WebSocket connection closed")
    }

    // Cleanup function to close the WebSocket connection
    return () => {
      ws.close()
    }
  }, [])

  return (
    <div>
      <p className="text-blue-600">uploaded</p>
      <p className="text-blue-600">{message}</p>
      {/* Display the message in a paragraph */}
    </div>
  )
}

export default WebSocketClient
