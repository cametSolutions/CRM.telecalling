import React from "react"

export default function PrimaryUserDashBoard() {
  const cards = [
    {
      label: "support department",
      to: "/admin/support&department"
    },
    {
      label: "sales & marketing",
      to: "/admin/lead"
    },
    {
      label: "sales & marketing",
      to: "/admin/lead"
    },
    {
      label: "sales & marketing",
      to: "/admin/lead"
    }
  ]

  return (
    <div className="bg-gray-100 h-screen">
      <div className="flex justify-evenly">
        {cards.map((item) => (
          <div className="text-bold shadow-lg p-4 rounded-md">
            {item.label.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}
