// import React, { useMemo, useState } from "react"
// import { Menu, ChevronLeft, ChevronRight, X, Eye, EyeOff, LockKeyhole } from "lucide-react"

// import CategoryListIconFirst from "./CategoryListIconFirst"
// import CategoryDetailsModal from "./CategoryDetailsModal"

// const Sidebar = ({
//   handleMoreClick,
//   achievedPoints,
//   sidebarOpen,
//   toggleSidebar,
//   user,
//   selectedBranch,
//   setselectedBranch,
//   setselectedParentBranch,
//   branchOptions,
//   categorylist,
//   targetLoading,
//   BranchSelect,
//   SkeletonTable,
//   setAvatarOpen,
//   onPasswordChange
// }) => {
//   const [modalOpen, setModalOpen] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState(null)

//   const [passwordModalOpen, setPasswordModalOpen] = useState(false)
//   const [savingPassword, setSavingPassword] = useState(false)
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: ""
//   })
//   const [passwordErrors, setPasswordErrors] = useState({})
//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     next: false,
//     confirm: false
//   })

//   const expiryDate = useMemo(() => {
//     const now = new Date()
//     const next = new Date(now)
//     next.setMonth(next.getMonth() + 2)
//     return next.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric"
//     })
//   }, [])

//   const handleCategoryClick = (categoryId, categoryName) => {
//     const category = categorylist.find(
//       (cat) => String(cat.categoryId) === String(categoryId)
//     )

//     setSelectedCategory(category)
//     setModalOpen(true)

//     if (handleMoreClick) {
//       handleMoreClick(categoryId, categoryName)
//     }
//   }

//   const openPasswordModal = () => {
//     setPasswordForm({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: ""
//     })
//     setPasswordErrors({})
//     setPasswordModalOpen(true)
//   }

//   const closePasswordModal = () => {
//     setPasswordModalOpen(false)
//     setPasswordErrors({})
//     setShowPassword({
//       current: false,
//       next: false,
//       confirm: false
//     })
//   }

//   const sanitizePasswordValue = (value) => {
//     return value.trim().replace(/\s/g, "")
//   }

//   const handlePasswordInput = (field, value) => {
//     const cleaned = sanitizePasswordValue(value)
//     setPasswordForm((prev) => ({
//       ...prev,
//       [field]: cleaned
//     }))
//     setPasswordErrors((prev) => ({
//       ...prev,
//       [field]: ""
//     }))
//   }

//   const validatePasswordForm = () => {
//     const errors = {}
//     const currentPassword = passwordForm.currentPassword.trim()
//     const newPassword = passwordForm.newPassword.trim()
//     const confirmPassword = passwordForm.confirmPassword.trim()

//     if (!currentPassword) {
//       errors.currentPassword = "Current password is required"
//     }

//     if (!newPassword) {
//       errors.newPassword = "New password is required"
//     } else if (newPassword.length < 8) {
//       errors.newPassword = "Password must be at least 8 characters"
//     } else if (!/[A-Z]/.test(newPassword)) {
//       errors.newPassword = "Include at least one uppercase letter"
//     } else if (!/[a-z]/.test(newPassword)) {
//       errors.newPassword = "Include at least one lowercase letter"
//     } else if (!/[0-9]/.test(newPassword)) {
//       errors.newPassword = "Include at least one number"
//     } else if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(newPassword)) {
//       errors.newPassword = "Include at least one special character"
//     } else if (/\s/.test(newPassword)) {
//       errors.newPassword = "Spaces are not allowed"
//     }

//     if (!confirmPassword) {
//       errors.confirmPassword = "Confirm password is required"
//     } else if (newPassword !== confirmPassword) {
//       errors.confirmPassword = "Passwords do not match"
//     }

//     if (currentPassword && newPassword && currentPassword === newPassword) {
//       errors.newPassword = "New password must be different from current password"
//     }

//     setPasswordErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault()

//     if (!validatePasswordForm()) return

//     try {
//       setSavingPassword(true)

//       const payload = {
//         userId: user?.id || user?._id,
//         currentPassword: passwordForm.currentPassword.trim(),
//         newPassword: passwordForm.newPassword.trim(),
//         confirmPassword: passwordForm.confirmPassword.trim(),
//         passwordExpiryAt: (() => {
//           const d = new Date()
//           d.setMonth(d.getMonth() + 2)
//           return d.toISOString()
//         })()
//       }
// console.log(onPasswordChange)
// console.log(payload)
//       if (onPasswordChange) {
//         await onPasswordChange(payload)
//       } else {
//         console.log("Password payload:", payload)
//       }

//       closePasswordModal()
//     } catch (error) {
//       setPasswordErrors((prev) => ({
//         ...prev,
//         submit:
//           error?.response?.data?.message ||
//           error?.message ||
//           "Failed to update password"
//       }))
//     } finally {
//       setSavingPassword(false)
//     }
//   }

//   const passwordChecks = [
//     {
//       label: "Minimum 8 characters",
//       valid: passwordForm.newPassword.length >= 8
//     },
//     {
//       label: "One uppercase letter",
//       valid: /[A-Z]/.test(passwordForm.newPassword)
//     },
//     {
//       label: "One lowercase letter",
//       valid: /[a-z]/.test(passwordForm.newPassword)
//     },
//     {
//       label: "One number",
//       valid: /[0-9]/.test(passwordForm.newPassword)
//     },
//     {
//       label: "One special character",
//       valid: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(passwordForm.newPassword)
//     },
//     {
//       label: "No spaces",
//       valid:
//         passwordForm.newPassword.length > 0 &&
//         !/\s/.test(passwordForm.newPassword)
//     }
//   ]

//   return (
//     <>
//       <aside
//         className={`
//           flex h-full flex-col border-r border-teal-900/40
//           bg-gradient-to-b from-[#0f766e] to-[#115e59] text-white
//           transition-[width] duration-200 ease-in-out
//           lg:flex-shrink-0
//           ${sidebarOpen ? "w-full lg:w-[240px]" : "w-full lg:w-[64px]"}
//         `}
//       >
//         <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2.5 lg:hidden">
//           <button
//             type="button"
//             className="rounded-md p-1.5 text-slate-200 transition hover:bg-white/10"
//           >
//             <Menu size={16} strokeWidth={2.2} />
//           </button>
//         </div>

//         <div className="hidden justify-end px-2 pt-2 lg:flex">
//           <button
//             type="button"
//             onClick={toggleSidebar}
//             className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-slate-200 shadow-sm transition hover:bg-white/15"
//           >
//             {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
//           </button>
//         </div>

//         <div
//           className={`
//             shrink-0 transition-opacity duration-150
//             ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}
//           `}
//         >
//           <div className="px-3 pb-2 pt-1.5">
//             <div className="rounded-lg bg-white/10 px-2.5 py-2 shadow-sm ring-1 ring-white/10">
//               <div className="flex items-center gap-2.5">
//                 <button
//                   type="button"
//                   onClick={() => setAvatarOpen(true)}
//                   className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
//                 >
//                   <img
//                     src={
//                       user?.profileUrl ||
//                       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
//                     }
//                     alt="Profile"
//                     className="h-full w-full object-cover"
//                   />
//                 </button>

//                 <div className="min-w-0 flex-1">
//                   <h3 className="truncate text-[12px] font-semibold leading-4 text-white">
//                     {user?.name || "John Smith"}
//                   </h3>
//                   <p className="mt-0.5 text-[10px] font-medium leading-4 text-slate-300">
//                     {user?.department?.department || "user"}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-2 flex items-center justify-between gap-2">
//                 <button
//                   type="button"
//                   onClick={openPasswordModal}
//                   className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-medium text-white transition hover:bg-white/15"
//                 >
//                   <LockKeyhole size={12} />
//                   Change Password
//                 </button>

//                 <span className="rounded-full bg-slate-950/60 px-2 py-1 text-[9px] font-medium text-slate-300">
//                   Expires: {expiryDate}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-1.5">
//               <BranchSelect
//                 value={selectedBranch}
//                 onChange={(value) => {
//                   setselectedParentBranch(value)
//                   setselectedBranch(value)
//                 }}
//                 options={branchOptions}
//               />
//             </div>
//           </div>

//           <div className="px-3">
//             <div className="mt-1 rounded-lg bg-slate-950/80 px-3 py-2.5 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-300">
//                   Score Board
//                 </span>
//                 <span className="text-[10px] font-medium text-slate-400">
//                   {categorylist?.length || 0} categories
//                 </span>
//               </div>

//               <div className="mt-1.5 flex items-center justify-between">
//                 <span className="text-[11px] font-medium leading-4 text-slate-200">
//                   Achieved Points
//                 </span>
//                 <span className="text-[16px] font-semibold leading-none text-white">
//                   {achievedPoints}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           className={`
//             min-h-0 flex-1 transition-opacity duration-150
//             ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}
//           `}
//         >
//           {targetLoading ? (
//             <div className="p-3">
//               <SkeletonTable rows={6} columns={2} />
//             </div>
//           ) : (
//             <div className="h-full overflow-y-auto px-2 py-2">
//               <CategoryListIconFirst
//                 categorylist={categorylist}
//                 handleMoreClick={handleMoreClick}
//                 sidebarOpen={sidebarOpen}
//                 onCategoryClick={handleCategoryClick}
//               />
//             </div>
//           )}
//         </div>
//       </aside>

//       <CategoryDetailsModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         category={selectedCategory}
//       />

//       {/* {passwordModalOpen && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
//             <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
//               <div>
//                 <h3 className="text-[16px] font-semibold text-slate-900">
//                   Update password
//                 </h3>
//                 <p className="mt-1 text-[12px] text-slate-500">
//                   Your new password will expire automatically after 2 months.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={closePasswordModal}
//                 className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
//               >
//                 <X size={16} />
//               </button>
//             </div>

//             <form onSubmit={handlePasswordSubmit} className="px-5 py-4">
//               <div className="space-y-4">
//                 <PasswordField
//                   label="Current Password"
//                   value={passwordForm.currentPassword}
//                   onChange={(e) =>
//                     handlePasswordInput("currentPassword", e.target.value)
//                   }
//                   error={passwordErrors.currentPassword}
//                   placeholder="Enter current password"
//                   autoComplete="current-password"
//                   visible={showPassword.current}
//                   onToggle={() =>
//                     setShowPassword((prev) => ({
//                       ...prev,
//                       current: !prev.current
//                     }))
//                   }
//                 />

//                 <PasswordField
//                   label="New Password"
//                   value={passwordForm.newPassword}
//                   onChange={(e) =>
//                     handlePasswordInput("newPassword", e.target.value)
//                   }
//                   error={passwordErrors.newPassword}
//                   placeholder="Enter new password"
//                   autoComplete="new-password"
//                   visible={showPassword.next}
//                   onToggle={() =>
//                     setShowPassword((prev) => ({
//                       ...prev,
//                       next: !prev.next
//                     }))
//                   }
//                 />

//                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
//                   <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
//                     Password requirements
//                   </p>
//                   <div className="grid grid-cols-1 gap-1.5">
//                     {passwordChecks.map((item) => (
//                       <div
//                         key={item.label}
//                         className={`text-[12px] ${
//                           item.valid ? "text-emerald-600" : "text-slate-500"
//                         }`}
//                       >
//                         {item.valid ? "✓" : "•"} {item.label}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <PasswordField
//                   label="Confirm Password"
//                   value={passwordForm.confirmPassword}
//                   onChange={(e) =>
//                     handlePasswordInput("confirmPassword", e.target.value)
//                   }
//                   error={passwordErrors.confirmPassword}
//                   placeholder="Re-enter new password"
//                   autoComplete="new-password"
//                   visible={showPassword.confirm}
//                   onToggle={() =>
//                     setShowPassword((prev) => ({
//                       ...prev,
//                       confirm: !prev.confirm
//                     }))
//                   }
//                 />

//                 <div className="rounded-xl border border-teal-100 bg-teal-50 px-3 py-2.5">
//                   <p className="text-[12px] font-medium text-teal-800">
//                     Password expiry date: {expiryDate}
//                   </p>
//                 </div>

//                 {passwordErrors.submit ? (
//                   <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
//                     {passwordErrors.submit}
//                   </div>
//                 ) : null}
//               </div>

//               <div className="mt-5 flex items-center justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={closePasswordModal}
//                   className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={savingPassword}
//                   className="rounded-lg bg-teal-700 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {savingPassword ? "Updating..." : "Update Password"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )} */}
// {passwordModalOpen && (
//   <div className="fixed inset-0 z-[70] bg-slate-950/55 p-2 sm:p-3">
//     <div className="flex min-h-full items-center justify-center">
//       <div className="flex w-full max-w-sm max-h-screen flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
//         <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-3 py-2.5">
//           <div>
//             <h3 className="text-[14px] font-semibold text-slate-900">
//               Update password
//             </h3>
//             <p className="mt-0.5 text-[11px] text-slate-500">
//               Expires automatically after 2 months
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={closePasswordModal}
//             className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
//           >
//             <X size={14} />
//           </button>
//         </div>

//         <form onSubmit={handlePasswordSubmit} className="flex min-h-0 flex-1 flex-col">
//           <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2.5">
//             <div className="space-y-3">
//               {/* <PasswordField
//                 label="Current Password"
//                 value={passwordForm.currentPassword}
//                 onChange={(e) =>
//                   handlePasswordInput("currentPassword", e.target.value)
//                 }
//                 error={passwordErrors.currentPassword}
//                 placeholder="Enter current password"
//                 autoComplete="current-password"
//                 visible={showPassword.current}
//                 onToggle={() =>
//                   setShowPassword((prev) => ({
//                     ...prev,
//                     current: !prev.current
//                   }))
//                 }
//               /> */}
// <PasswordField
//   label="Current Password"
//   value={passwordForm.currentPassword}
//   onChange={(e) => handlePasswordInput("currentPassword", e.target.value)}
//   error={passwordErrors.currentPassword}
//   placeholder="Enter current password"
//   autoComplete="current-password"
//   visible={showPassword.current}
//   onToggle={() =>
//     setShowPassword((prev) => ({
//       ...prev,
//       current: !prev.current
//     }))
//   }
// />

//               <PasswordField
//                 label="New Password"
//                 value={passwordForm.newPassword}
//                 onChange={(e) =>
//                   handlePasswordInput("newPassword", e.target.value)
//                 }
//                 error={passwordErrors.newPassword}
//                 placeholder="Enter new password"
//                 autoComplete="new-password"
//                 visible={showPassword.next}
//                 onToggle={() =>
//                   setShowPassword((prev) => ({
//                     ...prev,
//                     next: !prev.next
//                   }))
//                 }
//               />

//               <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
//                 <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
//                   Rules
//                 </p>
//                 <div className="grid grid-cols-1 gap-1">
//                   {passwordChecks.map((item) => (
//                     <div
//                       key={item.label}
//                       className={`text-[11px] leading-4 ${
//                         item.valid ? "text-emerald-600" : "text-slate-500"
//                       }`}
//                     >
//                       {item.valid ? "✓" : "•"} {item.label}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <PasswordField
//                 label="Confirm Password"
//                 value={passwordForm.confirmPassword}
//                 onChange={(e) =>
//                   handlePasswordInput("confirmPassword", e.target.value)
//                 }
//                 error={passwordErrors.confirmPassword}
//                 placeholder="Re-enter new password"
//                 autoComplete="new-password"
//                 visible={showPassword.confirm}
//                 onToggle={() =>
//                   setShowPassword((prev) => ({
//                     ...prev,
//                     confirm: !prev.confirm
//                   }))
//                 }
//               />

//               <div className="rounded-lg border border-teal-100 bg-teal-50 px-2.5 py-2">
//                 <p className="text-[11px] font-medium text-teal-800">
//                   Expiry: {expiryDate}
//                 </p>
//               </div>

//               {passwordErrors.submit ? (
//                 <div className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-[11px] text-red-600">
//                   {passwordErrors.submit}
//                 </div>
//               ) : null}
//             </div>
//           </div>

//           <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-white px-3 py-2.5">
//             <button
//               type="button"
//               onClick={closePasswordModal}
//               className="rounded-md border border-slate-300 px-3 py-1.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={savingPassword}
//               className="rounded-md bg-teal-700 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {savingPassword ? "Updating..." : "Update"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
// )}
//     </>
//   )
// }

// const PasswordField = ({
//   label,
//   value,
//   onChange,
//   error,
//   placeholder,
//   autoComplete,
//   visible,
//   onToggle
// }) => {
//   return (
//     <div>
//       <label className="mb-1.5 block text-[12px] font-medium text-slate-700">
//         {label}
//       </label>

//       <div
//         className={`flex items-center overflow-hidden rounded-xl border bg-white ${
//           error ? "border-red-300" : "border-slate-300"
//         }`}
//       >
//         <input
//           type={visible ? "text" : "password"}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           autoComplete={autoComplete}
//           className="h-11 flex-1 border-0 bg-transparent px-3 text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
//         />
//         <button
//           type="button"
//           onClick={onToggle}
//           className="px-3 text-slate-500 transition hover:text-slate-700"
//         >
//           {visible ? <EyeOff size={16} /> : <Eye size={16} />}
//         </button>
//       </div>

//       {error ? (
//         <p className="mt-1 text-[11px] font-medium text-red-500">{error}</p>
//       ) : null}
//     </div>
//   )
// }

// export default Sidebar

import React, { useEffect, useMemo, useState } from "react"
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  Eye,
  EyeOff,
  LockKeyhole,
  Camera,
  Clock3,
  LayoutGrid
} from "lucide-react"
import { CustomSelect } from "../common/CustomSelect"
import CategoryListIconFirst from "./CategoryListIconFirst"
import CategoryDetailsModal from "./CategoryDetailsModal"
import { useFetcher } from "react-router-dom"
import { parse } from "date-fns"

const Sidebar = ({
  handleMoreClick,
  onpasswordClick,
  targetData,
  onselectedPeriodChange,
  onperformanceModalClick,
  achievedPoints,
  sidebarOpen,
  toggleSidebar,
  user,
  selectedBranch,
  setselectedBranch,
  onLogoutClick,
  // setselectedParentBranch,
  branchOptions,
  categorylist,
  targetLoading,
  BranchSelect,
  SkeletonTable,
  setAvatarOpen,
  onPasswordChange,
  isMobile,
  selectedYear,
  setSelectedYear,
  onavataropenClick
}) => {
  console.log(targetData)
  console.log(categorylist)
  console.log(selectedBranch)
  console.log(user)
  const [modalOpen, setModalOpen] = useState(false)
console.log(modalOpen)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [localSelectedPeriod, setLocalSelectedPeriod] = useState(
    targetData?.selectedPeriodName
  )
  console.log(targetData?.selectedPeriodName)
  console.log(localSelectedPeriod)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false
  })
  useEffect(() => {
    setLocalSelectedPeriod(targetData?.selectedPeriodName)
  }, [targetData])
  const expiryDate = useMemo(() => {
    const now = new Date()
    const next = new Date(now)
    next.setMonth(next.getMonth() + 2)
    return next.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }, [])
  const MONTH_NAME_TO_NUM = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12
  }
const SHORT_MONTH_MAP = {
  january: "Jan",
  february: "Feb",
  march: "Mar",
  april: "Apr",
  may: "May",
  june: "Jun",
  july: "Jul",
  august: "Aug",
  september: "Sep",
  october: "Oct",
  november: "Nov",
  december: "Dec",
}

const getShortMonth = (monthName = "") => {
  const key = String(monthName).trim().toLowerCase()
  return SHORT_MONTH_MAP[key] || String(monthName).slice(0, 3)
}
  const getPeriodRange = (periodLabel) => {
    if (!periodLabel) return null
    console.log("hhh")
console.log(periodLabel)
    const cleaned = String(periodLabel).trim()
    const match = cleaned.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)\s+(\d{4})$/)

    if (!match) return null
console.log(match)
    const [, startMonthName, endMonthName, year] = match
    const startNum = MONTH_NAME_TO_NUM[startMonthName.toLowerCase()]
    const endNum = MONTH_NAME_TO_NUM[endMonthName.toLowerCase()]

    if (!startNum || !endNum) return null

    return {
      startNum,
      endNum,
      year: Number(year),
 displayLabel: `${getShortMonth(startMonthName)} - ${getShortMonth(endMonthName)}`,
    }
  }
  const periodOptions = useMemo(() => {
    return (targetData.periods || []).map((period) => {
console.log(period)
      const parsed = getPeriodRange(period)
console.log(parsed)
      return {
        value: period,
        label: parsed?.displayLabel || String(period).replace(/\s+\d{4}$/, "")
      }
    })
  }, [targetData.periods])
  console.log(periodOptions)

  const normalizedCategories = useMemo(() => {
    return (categorylist || []).map((item) => {
      const target = Number(item.targetamount || 0)
      const achieved = Number(item.achievedamount || 0)
      const percent = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

      return {
        ...item,
        target,
        achieved,
        percent
      }
    })
  }, [categorylist])
  console.log(normalizedCategories)
  const handleCategoryClick = (categoryId, categoryName) => {
    const category = normalizedCategories.find(
      (cat) => String(cat.categoryId) === String(categoryId)
    )

    setSelectedCategory(category || null)
    setModalOpen(true)

    if (handleMoreClick) {
      handleMoreClick(categoryId, categoryName)
    }
  }

  const openPasswordModal = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setPasswordErrors({})
    setShowPassword({
      current: false,
      next: false,
      confirm: false
    })
    setPasswordModalOpen(true)
  }

  const closePasswordModal = () => {
    setPasswordModalOpen(false)
    setPasswordErrors({})
    setShowPassword({
      current: false,
      next: false,
      confirm: false
    })
  }

  const sanitizePasswordValue = (value) => value.replace(/\s/g, "").trim()

  const handlePasswordInput = (field, value) => {
    const cleaned = sanitizePasswordValue(value)
    setPasswordForm((prev) => ({
      ...prev,
      [field]: cleaned
    }))
    setPasswordErrors((prev) => ({
      ...prev,
      [field]: "",
      submit: ""
    }))
  }

  const validatePasswordForm = () => {
    const errors = {}
    const currentPassword = passwordForm.currentPassword.trim()
    const newPassword = passwordForm.newPassword.trim()
    const confirmPassword = passwordForm.confirmPassword.trim()

    if (!currentPassword) {
      errors.currentPassword = "Current password is required"
    }

    if (!newPassword) {
      errors.newPassword = "New password is required"
    } else if (newPassword.length < 8) {
      errors.newPassword = "Minimum 8 characters required"
    } else if (!/[A-Z]/.test(newPassword)) {
      errors.newPassword = "Include one uppercase letter"
    } else if (!/[a-z]/.test(newPassword)) {
      errors.newPassword = "Include one lowercase letter"
    } else if (!/[0-9]/.test(newPassword)) {
      errors.newPassword = "Include one number"
    } else if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(newPassword)) {
      errors.newPassword = "Include one special character"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required"
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.newPassword =
        "New password must be different from current password"
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }
  const handlePeriodChange = (value) => {
    setLocalSelectedPeriod(value)
    console.log(value)
    const parsed = getPeriodRange(value)
    const firstMonthNumber = parsed?.startNum || null
    console.log(firstMonthNumber)
    if (firstMonthNumber && onselectedPeriodChange) {
      onselectedPeriodChange(value, firstMonthNumber)
    }
  }
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!validatePasswordForm()) return

    try {
      setSavingPassword(true)

      const payload = {
        userId: user?.id || user?._id,
        currentPassword: passwordForm.currentPassword.trim(),
        newPassword: passwordForm.newPassword.trim(),
        confirmPassword: passwordForm.confirmPassword.trim(),
        passwordExpiryAt: (() => {
          const d = new Date()
          d.setMonth(d.getMonth() + 2)
          return d.toISOString()
        })()
      }

      if (onPasswordChange) {
        await onPasswordChange(payload)
      }

      closePasswordModal()
    } catch (error) {
      setPasswordErrors((prev) => ({
        ...prev,
        submit:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update password"
      }))
    } finally {
      setSavingPassword(false)
    }
  }
  const yearOptions = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const year = new Date().getFullYear() - i
      return { value: String(year), label: String(year) }
    })
  }, [])
  const passwordChecks = [
    {
      label: "Minimum 8 characters",
      valid: passwordForm.newPassword.length >= 8
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(passwordForm.newPassword)
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(passwordForm.newPassword)
    },
    {
      label: "One number",
      valid: /[0-9]/.test(passwordForm.newPassword)
    },
    {
      label: "One special character",
      valid: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(
        passwordForm.newPassword
      )
    },
    {
      label: "No spaces",
      valid:
        passwordForm.newPassword.length > 0 &&
        !/\s/.test(passwordForm.newPassword)
    }
  ]

  const companyName = user?.activeCompany?.companyName || "CAMET"
  const companyShort = companyName?.slice(0, 1)?.toUpperCase() || "C"
  console.log(sidebarOpen)
  return (
    <>
      {/* <aside
        className={`
          flex h-full flex-col border-r border-teal-900/40
          bg-gradient-to-b from-[#0f766e] to-[#115e59] text-white
          transition-[width] duration-200 ease-in-out
          lg:flex-shrink-0
          ${sidebarOpen ? "w-full lg:w-[220px]" : "w-full lg:w-[64px]"}
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-1 py-2">
          <div
            className={`flex min-w-0 items-center gap-2 transition-opacity ${
              sidebarOpen ? "opacity-100" : "lg:opacity-0"
            }`}
          >
           
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-lg font-bold shadow-[0_6px_18px_rgba(56,189,248,0.35)]">
              {companyShort}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-bold">
                {companyName}
              </div>

              <div className="text-[9px] uppercase tracking-[0.18em] text-white/65">
                CRM
              </div>
            </div>
          </div>

          {isMobile ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-md p-1.5 text-slate-200 transition hover:bg-white/10"
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-slate-200 shadow-sm transition hover:bg-white/15"
            >
              {sidebarOpen ? (
                <ChevronLeft size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          )}
        </div>

        {sidebarOpen && (
          <>
            <div className="shrink-0 px-1 py-2">
              <div className="rounded-xl bg-white/10 p-2 ring-1 ring-white/10">
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onavataropenClick()}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    {user?.profileUrl ? (
                      <img
                        src={user.profileUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#083d43] text-sm font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}

                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#0f766e]">
                      <Camera size={9} />
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-2 rounded-lg bg-white/10 p-1.5">
                <BranchSelect
                  value={selectedBranch}
                  onChange={(value) => {
                    // setselectedParentBranch(value)
                    setselectedBranch(value)
                  }}
                  className="w-[200px] shrink-0"
                  options={branchOptions}
                />
              </div>

              <div className="mt-2 rounded-lg bg-slate-950/75 px-2.5 py-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-300">
                    Score Board
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">
                    {normalizedCategories.length}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-200">
                    <LayoutGrid size={11} />
                    Points
                  </span>
                  <span className="text-[15px] font-semibold leading-none text-white">
                    {achievedPoints || 0}
                  </span>
                </div>
              </div>
               

                <div className="grid grid-cols-[1fr_88px] gap-1 m-1">
                  <CustomSelect
                    value={localSelectedPeriod}
                    onChange={handlePeriodChange}
                    labelClassName="text-white"
                    options={periodOptions}
                    className="w-[120px]"
                    // label="Select Period"
                    // labletrue
                  />

                  <CustomSelect
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={yearOptions}
                    labelClassName="text-white"
                    placeholder="Year"
                    className="w-[80px]"
                    // label="Select Year"
                    // labletrue
                  />
                </div>
              
            </div>

            <div className="min-h-0 flex-1 px-1 pb-2">
              <div className="flex h-full min-h-0 flex-col rounded-xl bg-white/5 p-2 ring-1 ring-white/5">
                <div className="mb-1 shrink-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70">
                    Categories
                  </div>
                
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                  {targetLoading ? (
                    <SkeletonTable rows={8} columns={2} />
                  ) : (
                    <CategoryListIconFirst
                      categorylist={normalizedCategories}
                      handleMoreClick={handleMoreClick}
                      sidebarOpen={sidebarOpen}
                      onCategoryClick={handleCategoryClick}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </aside> */}

  <aside
  className={`
    flex h-full flex-col overflow-hidden border-r border-white/10
    bg-gradient-to-b from-[#0d5c56] via-[#0f6c67] to-[#0a4a45] text-white
    backdrop-blur-xl transition-[width] duration-300 ease-out
    lg:flex-shrink-0
    ${sidebarOpen ? "w-full lg:w-[200px]" : "w-full lg:w-[60px]"}
  `}
>
  {/* Header */}
  <div className="flex items-center justify-between border-b border-white/10 px-2 py-2">
    <div
      className={`flex min-w-0 items-center gap-2 transition-opacity duration-200 ${
        sidebarOpen ? "opacity-100" : "lg:opacity-0"
      }`}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-[11px] font-bold shadow-[0_3px_10px_rgba(56,189,248,0.4)] ring-1 ring-white/20">
        {companyShort}
      </div>

      <div className="min-w-0">
        <div className="truncate text-[12px] font-bold leading-4 tracking-tight">
          {companyName}
        </div>
        <div className="text-[8px] font-medium uppercase tracking-[0.16em] text-white/50">
          CRM
        </div>
      </div>
    </div>

    {isMobile ? (
      <button
        type="button"
        onClick={toggleSidebar}
        className="rounded-md p-1 text-slate-200 transition-colors duration-150 hover:bg-white/10 active:bg-white/15"
      >
        <X size={15} strokeWidth={2.2} />
      </button>
    ) : (
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-200 ring-1 ring-white/10 transition-all duration-150 hover:bg-white/20 hover:ring-white/20 active:scale-95"
      >
        {sidebarOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
      </button>
    )}
  </div>

  {sidebarOpen && (
    <>
      <div className="shrink-0 space-y-1.5 px-1.5 py-1.5">
        {/* Profile */}
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => onavataropenClick()}
              className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/20 shadow-md transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#0f6c67]"
            >
              {user?.profileUrl ? (
                <img
                  src={user.profileUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#083d43] text-xs font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />

              <span className="absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#0f766e] shadow-sm ring-1 ring-black/5">
                <Camera size={9} />
              </span>
            </button>
          </div>
        </div>

        {/* Branch */}
        <div className="rounded-lg bg-white/[0.08] p-1 ring-1 ring-white/10 transition-colors duration-150 hover:bg-white/[0.1]">
          <BranchSelect
            value={selectedBranch}
            onChange={(value) => {
              setselectedBranch(value)
            }}
            className="w-full min-w-0"
            options={branchOptions}
          />
        </div>

        {/* Score board */}
        <div className="rounded-lg bg-slate-950/70 px-2 py-1.5 shadow-inner ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Score Board
            </span>
            <span className="rounded-full bg-white/5 px-1 py-0.5 text-[8px] font-medium text-slate-400">
              {normalizedCategories.length}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-200">
              <LayoutGrid size={10} className="text-sky-400" />
              Points
            </span>
            <span className="text-[14px] font-bold leading-none tracking-tight text-white">
              {achievedPoints || 0}
            </span>
          </div>
        </div>

        {/* Period + Year */}
        <div className="rounded-lg bg-white/[0.05] p-1 ring-1 ring-white/[0.08]">
          <div className="mb-1 px-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/60">
            Select Period
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_64px] gap-1">
            <CustomSelect
              value={localSelectedPeriod}
              onChange={handlePeriodChange}
              options={periodOptions}
              labelClassName="text-white"
              className="min-w-0 w-full"
              placeholder="Period"
            />

            <CustomSelect
              value={selectedYear}
              onChange={setSelectedYear}
              options={yearOptions}
              labelClassName="text-white"
              placeholder="Year"
              className="min-w-0 w-full"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="min-h-0 flex-1 px-1.5 pb-1.5">
        <div className="flex h-full min-h-0 flex-col rounded-xl border border-white/[0.08] bg-white/[0.05] p-1.5">
          <div className="mb-1 shrink-0 px-1">
            <div className="text-[9px] font-semibold uppercase tracking-[0.08em] text-white/60">
              Categories
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-0.5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
            {targetLoading ? (
              <SkeletonTable rows={8} columns={2} />
            ) : (
              <CategoryListIconFirst
                categorylist={normalizedCategories}
                handleMoreClick={handleMoreClick}
                sidebarOpen={sidebarOpen}
                onCategoryClick={handleCategoryClick}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )}
</aside>

    
    </>
  )
}



export default Sidebar
