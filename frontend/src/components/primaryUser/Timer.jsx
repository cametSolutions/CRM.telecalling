// Timer.jsx
import React, { useState, useEffect, useRef } from "react"
import { formatTime } from "../../utils/timeUtils"

// Adjust the import path as needed

const Timer = ({ isRunning, startTime, onStop }) => {
  const [time, setTime] = useState(0)
  const wasRunning = useRef(isRunning)
  useEffect(() => {
   

    let interval = null

    if (isRunning) {
      interval = setInterval(() => {
        // Get the current time and calculate the difference in seconds
        const currentTime = new Date()
        const elapsedTime = Math.floor((currentTime - startTime) / 1000)
        if (isNaN(elapsedTime)) {
          console.error("Invalid elapsed time", currentTime, startTime)
          return
        }

        // Calculate hours, minutes, and seconds from elapsed time
        const hours = Math.floor(elapsedTime / 3600)
        const minutes = Math.floor((elapsedTime % 3600) / 60)
        const seconds = elapsedTime % 60

        // Format the time as hh:mm:ss (with leading zeros for single digit values)
        const formattedTime = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

        setTime(formattedTime)
        // setTime(Math.floor(new Date() - startTime / 1000))
      }, 1000)
    } else {
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, startTime])

  useEffect(() => {
    if (wasRunning.current && !isRunning && startTime !== null) {
      // Only call onStop when the timer transitions from running to stopped
      onStop(time)
    }
    wasRunning.current = isRunning
  }, [isRunning, onStop, startTime])

  return (
    <div className="flex container justify-center items-center">
      <p className="text-2xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        Call Duration: {time}
      </p>
    </div>
  )
}

export default Timer
