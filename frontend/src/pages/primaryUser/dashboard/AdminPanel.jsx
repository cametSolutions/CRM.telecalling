import React, { useEffect, useState } from "react"
import UseFetch from "../../../hooks/useFetch"
import api from "../../../api/api"

export default function AdminPanel() {
  const [leave, setleave] = useState([])
  const [loader, setloader] = useState(false)
  const [stats, setStats] = useState(null)
  const { data, refreshHook } = UseFetch("/auth/adminpanelleavecount")
  console.log(data)
  useEffect(() => {
    setStats(data)
  }, [data])
  console.log(stats)
  const renderStatList = (title1, title2) => (
    <div className="px-1 py-3 bg-gradient-to-r from-blu-900 via--100 to-blue-500 rounded shadow-md text-left text-sm border border-gray-200 ">
      <div className="">
        <p className="font-bold mb-1">
          {title1?.title} - {title1?.name ? title1?.name : "N/A"} -
          {title1?.count}
        </p>
      </div>
      <div className="">
        <p className="font-bold mb-1">
          {title2?.title} - {title2?.name ? title2?.name : "N/A"} -
          {title2?.count}
        </p>
      </div>
    </div>
  )
  return (
    <div className="md:p-6 h-full overflow-y-auto bg-blue-50">
      <div className="rounded-lg shadow-xl h-full bg-white">
        <h1 className="text-2xl font-semibold text-center mb-1">Admin Panel</h1>
        <div className="text-right pr-3 mb-2">
          <select className="border border-gray-200 rounded-md shadow-lg focus:outline-none px-2 py-1">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:px-3 md:px-2">
          {renderStatList(stats?.highestLeave, stats?.lowestLeave)}
          {renderStatList(stats?.highestOnsite, stats?.lowestOnsite)}
          {renderStatList(stats?.highestleave, stats?.lowestleave)}
          {renderStatList(stats?.highestleave, stats?.lowestleave)}
          {renderStatList(stats?.highestLead, stats?.highestLead)}

          {/* {renderStatList("Least Leave Taken", "sreeraj")}
          {renderStatList("Most Onsite  Taken", "midhun")} */}
        </div>
      </div>
    </div>
  )
}
