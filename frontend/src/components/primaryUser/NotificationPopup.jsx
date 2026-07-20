import { useState } from "react"
import {
  Mail,
  MessageSquareText,
  Bell,
  X,
  Settings,
  User,
  Users,
  Send,
  TrendingUp,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import {
  IndianRupee,
  Wallet,
  CalendarDays,
  CalendarRange,
  PiggyBank
} from "lucide-react"
export const  NotificationPopup=({open, onClose, notificationData })=> {
if(!open)return
  const [showTasks, setShowTasks] = useState(false)
  const [showFollowups, setShowFollowups] = useState(false)
    const notifications = [
    {
      type: "news",
      title: "New Notification",
      unread: true,
      data: {
        tasks: notificationData.pendingTasks ?? [],
        followups: notificationData.pendingFollowups ?? []
      }
    },
    {
      type: "leave",
      title: "Today's Leave",
      unread: true,
      data: notificationData.leaves ?? []
    },
    {
      type: "birthday",
      title: "Birthdays",
      unread: false,
      data: notificationData.birthdays ?? []
    },
    {
      type: "holiday",
      title: "Monthly Holidays",
      unread: false,
      data: notificationData.holidays ?? []
    },
    {
      type: "quarterly",
      title: "Quarterly Achievers",
      unread: false,
      data: notificationData.quarterlyAchievers ?? []
    },
    {
      type: "yearly",
      title: "Yearly Achievers",
      unread: false,
      data: notificationData.yearlyAchievers ?? []
    }
  ]
 const formatDateToDDMMYYYY = (dateValue) => {
    if (!dateValue) return ""
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return ""
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }
console.log(notifications)

  return (
    <div className="fixed bottom-3 right-3 z-50 flex w-72 max-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15">
            <Bell size={16} className="text-blue-400" />
          </div>

          <span className="text-sm font-semibold text-white">
            Notifications
          </span>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto bg-slate-900 p-3 space-y-3">
       
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-900 ">
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-900 ">
            {notifications.map((item, index) => (
              <div
                key={index}
                className={`rounded-lg border p-2 transition-colors ${
                  item.unread
                    ? "border-blue-500/20 bg-slate-800"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold tracking-wide text-white">
                    {item.title}
                  </h3>

                  {item.unread && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  )}
                </div>
                {item.type === "news" && (
                  <div className="space-y-2">
                    {/* Pending Tasks */}
                    <div className="rounded-md border border-orange-500/20 bg-slate-700/40">
                      <button
                        onClick={() => setShowTasks(!showTasks)}
                        className="flex w-full items-center justify-between px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span>📋</span>

                          <span className="text-[11px] font-semibold text-orange-300">
                            Pending Tasks
                          </span>

                          <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] text-orange-300">
                            {item.data.tasks.length}
                          </span>
                        </div>

                        {showTasks ? (
                          <ChevronUp size={15} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={15} className="text-slate-400" />
                        )}
                      </button>

                      {showTasks && (
                        <div className="space-y-1 border-t border-slate-600 px-2 py-2">
                          {item.data.tasks.map((task, i) => (
                            <div
                              key={i}
                              className="rounded bg-slate-800 px-2 py-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <p className="truncate text-[11px] font-medium text-white">
                                  {task?.pendingTask?.taskName}
                                </p>

                                <span className="text-[10px] font-medium text-red-400">
                                  {formatDateToDDMMYYYY(task.dueDate)}
                                </span>
                              </div>

                              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                {task.remark}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pending Follow-ups */}
                    <div className="rounded-md border border-blue-500/20 bg-slate-700/40">
                      <button
                        onClick={() => setShowFollowups(!showFollowups)}
                        className="flex w-full items-center justify-between px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span>📞</span>

                          <span className="text-[11px] font-semibold text-blue-300">
                            Pending Follow-ups
                          </span>

                          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] text-blue-300">
                            {item.data.followups.length}
                          </span>
                        </div>

                        {showFollowups ? (
                          <ChevronUp size={15} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={15} className="text-slate-400" />
                        )}
                      </button>

                      {showFollowups && (
                        <div className="space-y-1 border-t border-slate-600 px-2 py-2">
                          {item.data.followups.map((followup, i) => (
                            <div
                              key={i}
                              className="rounded bg-slate-800 px-2 py-1.5"
                            >
                              <p className="truncate text-[11px] font-medium text-white">
                                {followup.customerName?.customerName.toUpperCase()}
                              </p>

                              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                {followup.lastRemark}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}


              
                {/* Leave */}
                {item.type === "leave" && (
                  <div className="space-y-1">
                    {item.data.map((staff, i) => (
                      <div
                        key={i}
                        className="rounded-md bg-slate-700 px-2 py-1 text-xs text-slate-200"
                      >
                        {staff.name.toUpperCase()}
                      </div>
                    ))}
                  </div>
                )}

                {/* Birthday */}
                {item.type === "birthday" && (
                  <div className="space-y-1">
                    {item.data.map((staff, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md bg-slate-700 px-2 py-1"
                      >
                        <span className="text-xs text-white">
                          🎂 {staff.name.toUpperCase()}
                        </span>

                        <span className="text-[10px] text-slate-300">
                          {staff.dob}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Holidays */}
                {item.type === "holiday" && (
                  <div className="space-y-1">
                    {item.data.map((holiday, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md bg-slate-700 px-2 py-1"
                      >
                        <span className="text-xs text-white">
                          📅 {holiday.holiday}
                        </span>

                        <span className="text-[10px] text-slate-300">
                          {holiday.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quarterly & Yearly */}
                {(item.type === "quarterly" || item.type === "yearly") && (
                  <div className="space-y-1">
                    {item.data.map((staff, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md bg-slate-700 px-2 py-1"
                      >
                        <img
                          src={staff.photo}
                          alt={staff.name}
                          className="h-8 w-8 rounded-full border border-yellow-400 object-cover"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-white">
                            {staff.name}
                          </p>

                          <p className="text-[10px] text-yellow-400">
                            🏆 Achiever
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}