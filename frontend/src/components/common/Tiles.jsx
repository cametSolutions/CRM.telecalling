import React, { useEffect, useState } from "react"

const Tiles = ({ list }) => {
  console.log("props", list)
  const [data, setData] = useState({})
  useEffect(() => {
    if (list) {
      setData(list)
    }
  }, [data])
  console.log("data", data)

  return (
    <div className="flex justify-evenly  rounded-lg shadow-lg">
      {/* Pending Tile */}
      <div className="mb-2 text-center">
        <h2 className="text-md font-semibold">Pending</h2>
        <span className="mt-1 px-6 py-4 text-md font-bold h-20 w-40 flex items-center justify-center bg-gradient-to-r from-red-400 to-red-600 rounded-md">
          {data.pending}
        </span>
      </div>

      {/* Solved Tile */}
      <div className="mb-2 text-center">
        <h2 className="text-md font-semibold">Solved</h2>
        <span className="mt-1 px-6 py-4 text-md font-bold h-20 w-40 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 rounded-md">
          {data.solved}
        </span>
      </div>

      {/* Today's Calls Tile */}
      <div className="mb-2 text-center">
        <h2 className="text-md font-semibold">Today's Calls</h2>
        <span className="mt-1 px-6 py-4 text-md font-bold h-20 w-40 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md">
          {data.todayCalls}
        </span>
      </div>

      {/* Total Token Tile */}
      <div className="mb-2 text-center">
        <h2 className="text-md font-semibold">Total Token</h2>
        <span className="mt-1 px-6 py-4 text-md font-bold h-20 w-40 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 rounded-md">
          {data.totalToken}
        </span>
      </div>
    </div>

    // <div className="flex justify-evenly p-6 rounded-lg shadow-lg">
    //   <div className=" bg-red-500 m-3">
    //     <h2 className="text-md font-semibold ">pending</h2>
    //     <span className="mt-4 px-6 py-4 text-md font-bold ">
    //       {data.list.pending}
    //     </span>
    //   </div>
    //   <div className="bg-green-500 m-3">
    //     <h2 className="text-md font-semibold ">Solved</h2>
    //     <span className=" mt-4 px-6 py-4 text-md font-bold   rounded-md">
    //       {data.list.solved}
    //     </span>
    //   </div>
    //   <div className=" bg-yellow-400 m-3">
    //     <h2 className="text-md font-semibold ">Today's Calls</h2>
    //     <span className="mt-4 px-6 py-4 text-md font-bold ">
    //       {data.list.todayCalls}
    //     </span>
    //   </div>
    //   <div className=" bg-blue-500 item-center justify-center m-3">
    //     <h2 className="text-md font-semibold ">Total Token</h2>
    //     <span className="bg-gray-500 mt-4  text-md font-bold ">
    //       {data.list.totalToken}
    //     </span>
    //   </div>
    // </div>
  )
}
export default Tiles
