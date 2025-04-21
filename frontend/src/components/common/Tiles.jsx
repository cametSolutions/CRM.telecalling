
import React from "react"

const Tiles = ({ title, count, style, onClick }) => {
  return (
    <div className="w-1/6 text-center mb-2">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div
        // className={`p-4 shadow-lg rounded text-center cursor-pointer  `}
        className={`flex flex-col items-center justify-center cursor-pointer p-4 rounded-lg shadow-lg transition-all duration-200 ease-in-out   `}
        style={{
          ...style // Spread the style prop here
        }}
        onClick={onClick}
      >
        <p className="text-3xl font-bold">{count}</p>
      </div>
    </div>
  )
}

export default Tiles
