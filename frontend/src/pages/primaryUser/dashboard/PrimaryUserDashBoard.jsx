import React, { useEffect, useState } from "react"
import {
  MdSupportAgent,
  MdAdminPanelSettings,
  MdScience,
  MdBarChart
} from "react-icons/md"
import { Link } from "react-router-dom"
import UseFetch from "../../../hooks/useFetch"
export default function PrimaryUserDashBoard() {
  const [leaveList, setTodayLeaveList] = useState([])
  const [birthdays, setCurrentmonthBirthdays] = useState([])
  const [user, setUser] = useState(null)
  const { data: todayleavelist } = UseFetch(
    user && `/auth/getallUsersLeave?today=true&loggeduser=${user.role}`
  )
  const { data: currrentMonthBirthDays } = UseFetch(
    user && `/auth/getallcurrentmonthBirthdays?loggeduser=${user.role}`
  )
  const { data: todayOnsite } = UseFetch(
    user && `/auth/h?today=true&loggeduser=${user.role}`
  )
  console.log(todayOnsite)
  console.log(currrentMonthBirthDays)
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setUser(user)
    console.log(user)
  }, [])
  useEffect(() => {
    console.log("h")
    setTodayLeaveList(todayleavelist)
    setCurrentmonthBirthdays(currrentMonthBirthDays)
  }, [todayleavelist, currrentMonthBirthDays])

  console.log(todayleavelist)
  const cards = [
    {
      label: "support department",
      to: "/admin/support&department",
      icon: MdSupportAgent
    },
    {
      label: "sales & marketing",
      to: "/admin/lead",
      icon: MdBarChart
    },
    {
      label: "research & development",
      to: "/admin/lead",
      icon: MdScience
    },
    {
      label: "admin",
      to: "/admin/lead",
      icon: MdAdminPanelSettings
    }
  ]
  console.log(leaveList)
  return (
    // <div className="bg-yellow-50 overflow-y-auto p-2 md:p-5 h-screen">
    <div className="h-full shadow-lg rounded-lg bg-green-50">
      <div className="flex flex-col md:flex-row md:justify-evenly md:gap-4 space-y-3 md:space-y-0  py-3">
        {cards.map((item, index) => {
          const Icon = item.icon
          return (
            <Link to={item.to} key={index} className="w-full md:w-60">
              <div className="w-full md:h-16 font-semibold shadow-lg p-3 rounded-md flex items-center gap-2 bg-gray-50 hover:bg-gray-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transform transition-all duration-300 ease-in-out">
                <Icon className="text-2xl md:text-4wxl text-blue-600" />
                {item.label.toUpperCase()}
              </div>
            </Link>
          )
        })}
      </div>
      <div className="flex flex-col lg:flex-row gap-4 mt-3  text-center p-1 md:p-4 rounded-lg mx-2 shadow-lg">
        {/* LEFT SIDE */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="flex  gap-4 min:h-60 ">
            <div className=" p-4 rounded w-1/2 bg-red-100 shadow-lg">
              <h2> Today Leave</h2>
              {leaveList?.map((item, index) => (
                <div key={index} className="text-left">
                  {index + 1}.{item}
                </div>
              ))}
            </div>
            <div className="p-4 rounded  w-1/2 bg-blue-50 shadow-lg">
              <h2> Birthdays</h2>
              {birthdays?.map((item, index) => (
                <div key={index} className="text-left">
                  {index + 1}.{item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-100 p-4 rounded-lg shadow-lg mt-4 flex-1  overflow-y-auto ">
            <h2 className="font-bold mb-2">Today Onsite</h2>
            <table className="w-full text-sm border">
              <thead className="bg-gray-300 ">
                <tr>
                  <th className="border p-1">Name</th>
                  <th className="border p-1">Customer Name</th>
                  <th className="border p-1">Place</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-purple-100">
                  <td className="border p-1">John</td>
                  <td className="border p-1">XYZ Ltd</td>
                  <td className="border p-1">Mumbai</td>
                </tr>
                <tr className="bg-purple-100">
                  <td className="border p-1">John</td>
                  <td className="border p-1">XYZ Ltd</td>
                  <td className="border p-1">Mumbai</td>
                </tr>
                <tr className="bg-purple-100">
                  <td className="border p-1">John</td>
                  <td className="border p-1">XYZ Ltd</td>
                  <td className="border p-1">Mumbai</td>
                </tr>
                <tr className="bg-purple-100">
                  <td className="border p-1">John</td>
                  <td className="border p-1">XYZ Ltd</td>
                  <td className="border p-1">Mumbai</td>
                </tr>
                <tr className="bg-purple-100">
                  <td className="border p-1">John</td>
                  <td className="border p-1">XYZ Ltd</td>
                  <td className="border p-1">Mumbai</td>
                </tr>
                <tr className="bg-purple-100">
                  <td className="border p-1">John</td>
                  <td className="border p-1">XYZ Ltd</td>
                  <td className="border p-1">Mumbai</td>
                </tr>
                <tr className="bg-purple-100">
                  <td className="border p-1">John</td>
                  <td className="border p-1">XYZ Ltd</td>
                  <td className="border p-1">Mumbai</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4 lg:w-1/2">
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            <div className="bg-blue-100 p-4 rounded  flex-1 shadow-lg">
              <h2 className="font-bold">Target & Achievements</h2>
              <p>Target: $1M</p>
              <p>Achieved: $850k</p>
            </div>
            <div className="bg-orange-100 p-4 rounded shadow-lg flex-1">
              <h2 className="font-bold">News & Announcements</h2>
              <ul className="list-disc pl-5">
                <li>Meeting at 4 PM</li>
                <li>System update tonight</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  )
}
