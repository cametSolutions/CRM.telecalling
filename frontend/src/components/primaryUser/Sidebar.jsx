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

          // <div className="px-3">
          //   <div className="mt-1 rounded-lg bg-slate-950/80 px-3 py-2.5 shadow-sm">
          //     <div className="flex items-center justify-between">
          //       <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-300">
          //         Score Board
          //       </span>
          //       <span className="text-[10px] font-medium text-slate-400">
          //         {categorylist?.length || 0} categories
          //       </span>
          //     </div>

          //     <div className="mt-1.5 flex items-center justify-between">
          //       <span className="text-[11px] font-medium leading-4 text-slate-200">
          //         Achieved Points
          //       </span>
          //       <span className="text-[16px] font-semibold leading-none text-white">
          //         {achievedPoints}
          //       </span>
          //     </div>
          //   </div>
          // </div>
        // </div>

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

// import React, { useEffect, useMemo, useState } from "react"
// import {
//   Menu,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   LogOut,
//   Eye,
//   EyeOff,
//   LockKeyhole,
//   Camera,
//   Clock3,
//   LayoutGrid
// } from "lucide-react"
// import { CustomSelect } from "../common/CustomSelect"
// import CategoryListIconFirst from "./CategoryListIconFirst"
// import CategoryDetailsModal from "./CategoryDetailsModal"
// import { useFetcher } from "react-router-dom"
// import { parse } from "date-fns"

// const Sidebar = ({
//   handleMoreClick,
//   onpasswordClick,
//   targetData,
//   onselectedPeriodChange,
//   onperformanceModalClick,
//   achievedPoints,
//   sidebarOpen,
//   toggleSidebar,
//   user,
//   selectedBranch,
//   setselectedBranch,
//   onLogoutClick,
//   // setselectedParentBranch,
//   branchOptions,
//   categorylist,
//   targetLoading,
//   BranchSelect,
//   SkeletonTable,
//   setAvatarOpen,
//   onPasswordChange,
//   isMobile,
//   selectedYear,
//   setSelectedYear,
//   onavataropenClick
// }) => {
//   console.log(targetData)
//   console.log(categorylist)
//   console.log(selectedBranch)
//   console.log(user)
//   const [modalOpen, setModalOpen] = useState(false)
// console.log(modalOpen)
//   const [selectedCategory, setSelectedCategory] = useState(null)
//   const [localSelectedPeriod, setLocalSelectedPeriod] = useState(
//     targetData?.selectedPeriodName
//   )
//   console.log(targetData?.selectedPeriodName)
//   console.log(localSelectedPeriod)
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
//   useEffect(() => {
//     setLocalSelectedPeriod(targetData?.selectedPeriodName)
//   }, [targetData])
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
//   const MONTH_NAME_TO_NUM = {
//     january: 1,
//     february: 2,
//     march: 3,
//     april: 4,
//     may: 5,
//     june: 6,
//     july: 7,
//     august: 8,
//     september: 9,
//     october: 10,
//     november: 11,
//     december: 12
//   }
// const SHORT_MONTH_MAP = {
//   january: "Jan",
//   february: "Feb",
//   march: "Mar",
//   april: "Apr",
//   may: "May",
//   june: "Jun",
//   july: "Jul",
//   august: "Aug",
//   september: "Sep",
//   october: "Oct",
//   november: "Nov",
//   december: "Dec",
// }

// const getShortMonth = (monthName = "") => {
//   const key = String(monthName).trim().toLowerCase()
//   return SHORT_MONTH_MAP[key] || String(monthName).slice(0, 3)
// }
//   const getPeriodRange = (periodLabel) => {
//     if (!periodLabel) return null
//     console.log("hhh")
// console.log(periodLabel)
//     const cleaned = String(periodLabel).trim()
//     const match = cleaned.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)\s+(\d{4})$/)

//     if (!match) return null
// console.log(match)
//     const [, startMonthName, endMonthName, year] = match
//     const startNum = MONTH_NAME_TO_NUM[startMonthName.toLowerCase()]
//     const endNum = MONTH_NAME_TO_NUM[endMonthName.toLowerCase()]

//     if (!startNum || !endNum) return null

//     return {
//       startNum,
//       endNum,
//       year: Number(year),
//  displayLabel: `${getShortMonth(startMonthName)} - ${getShortMonth(endMonthName)}`,
//     }
//   }
//   const periodOptions = useMemo(() => {
//     return (targetData.periods || []).map((period) => {
// console.log(period)
//       const parsed = getPeriodRange(period)
// console.log(parsed)
//       return {
//         value: period,
//         label: parsed?.displayLabel || String(period).replace(/\s+\d{4}$/, "")
//       }
//     })
//   }, [targetData.periods])
//   console.log(periodOptions)

//   const normalizedCategories = useMemo(() => {
//     return (categorylist || []).map((item) => {
//       const target = Number(item.targetamount || 0)
//       const achieved = Number(item.achievedamount || 0)
//       const percent = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

//       return {
//         ...item,
//         target,
//         achieved,
//         percent
//       }
//     })
//   }, [categorylist])
//   console.log(normalizedCategories)
//   const handleCategoryClick = (categoryId, categoryName) => {
//     const category = normalizedCategories.find(
//       (cat) => String(cat.categoryId) === String(categoryId)
//     )

//     setSelectedCategory(category || null)
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
//     setShowPassword({
//       current: false,
//       next: false,
//       confirm: false
//     })
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

//   const sanitizePasswordValue = (value) => value.replace(/\s/g, "").trim()

//   const handlePasswordInput = (field, value) => {
//     const cleaned = sanitizePasswordValue(value)
//     setPasswordForm((prev) => ({
//       ...prev,
//       [field]: cleaned
//     }))
//     setPasswordErrors((prev) => ({
//       ...prev,
//       [field]: "",
//       submit: ""
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
//       errors.newPassword = "Minimum 8 characters required"
//     } else if (!/[A-Z]/.test(newPassword)) {
//       errors.newPassword = "Include one uppercase letter"
//     } else if (!/[a-z]/.test(newPassword)) {
//       errors.newPassword = "Include one lowercase letter"
//     } else if (!/[0-9]/.test(newPassword)) {
//       errors.newPassword = "Include one number"
//     } else if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(newPassword)) {
//       errors.newPassword = "Include one special character"
//     }

//     if (!confirmPassword) {
//       errors.confirmPassword = "Confirm password is required"
//     } else if (newPassword !== confirmPassword) {
//       errors.confirmPassword = "Passwords do not match"
//     }

//     if (currentPassword && newPassword && currentPassword === newPassword) {
//       errors.newPassword =
//         "New password must be different from current password"
//     }

//     setPasswordErrors(errors)
//     return Object.keys(errors).length === 0
//   }
//   const handlePeriodChange = (value) => {
//     setLocalSelectedPeriod(value)
//     console.log(value)
//     const parsed = getPeriodRange(value)
//     const firstMonthNumber = parsed?.startNum || null
//     console.log(firstMonthNumber)
//     if (firstMonthNumber && onselectedPeriodChange) {
//       onselectedPeriodChange(value, firstMonthNumber)
//     }
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

//       if (onPasswordChange) {
//         await onPasswordChange(payload)
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
//   const yearOptions = useMemo(() => {
//     return Array.from({ length: 6 }, (_, i) => {
//       const year = new Date().getFullYear() - i
//       return { value: String(year), label: String(year) }
//     })
//   }, [])
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
//       valid: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(
//         passwordForm.newPassword
//       )
//     },
//     {
//       label: "No spaces",
//       valid:
//         passwordForm.newPassword.length > 0 &&
//         !/\s/.test(passwordForm.newPassword)
//     }
//   ]

//   const companyName = user?.activeCompany?.companyName || "CAMET"
//   const companyShort = companyName?.slice(0, 1)?.toUpperCase() || "C"
//   console.log(sidebarOpen)
//   return (
//     <>
     
// <aside
//   className={`
//     flex h-full flex-col overflow-hidden border-r border-white/10
//     bg-gradient-to-b from-[#0d5c56] via-[#0f6c67] to-[#0a4a45] text-white
//     backdrop-blur-xl transition-[width] duration-300 ease-out
//     lg:flex-shrink-0
//     ${sidebarOpen ? "w-full lg:w-[220px]" : "w-full lg:w-[60px]"}
//   `}
// >
//   {/* Header */}
//   <div className="flex items-center justify-between px-3 py-3">
//     <div
//       className={`flex min-w-0 items-center gap-2 transition-opacity duration-200 ${
//         sidebarOpen ? "opacity-100" : "lg:opacity-0"
//       }`}
//     >
//       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold shadow-[0_3px_10px_rgba(56,189,248,0.4)]">
//         {companyShort}
//       </div>
//       <div className="min-w-0 truncate text-[14px] font-bold tracking-tight">
//         {companyName}
//       </div>
//     </div>

//     <button
//       type="button"
//       onClick={toggleSidebar}
//       className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition-colors duration-150 hover:bg-white/15 active:scale-95"
//     >
//       {isMobile ? (
//         <X size={16} strokeWidth={2.2} />
//       ) : sidebarOpen ? (
//         <ChevronLeft size={15} />
//       ) : (
//         <ChevronRight size={15} />
//       )}
//     </button>
//   </div>

//   {sidebarOpen && (
//     <>
//       <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-2.5 pb-2.5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
//         {/* Profile */}
//         <button
//           type="button"
//           onClick={() => onavataropenClick()}
//           className="flex w-full items-center gap-3 rounded-2xl bg-white/[0.08] px-3 py-2.5 text-left transition-colors duration-150 hover:bg-white/[0.12]"
//         >
//           <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/25">
//             {user?.profileUrl ? (
//               <img
//                 src={user.profileUrl}
//                 alt="Profile"
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               <div className="flex h-full w-full items-center justify-center bg-[#083d43] text-sm font-bold text-white">
//                 {user?.name?.charAt(0)?.toUpperCase() || "U"}
//               </div>
//             )}
//             <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[#0f766e] shadow-sm">
//               <Camera size={8} />
//             </span>
//           </div>

//           <div className="min-w-0 flex-1">
//             <p className="truncate text-[13px] font-semibold leading-4">
//               {user?.name || "User"}
//             </p>
//             <p className="truncate text-[10px] text-white/60">
//               {user?.role || user?.designation || "Member"}
//             </p>
//           </div>

//           <ChevronRight size={15} className="shrink-0 text-white/50" />
//         </button>

//         {/* Branch */}
//         <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.08] px-3 py-2.5">
//           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
//             <LayoutGrid size={15} className="text-white/80" />
//           </div>
//           <div className="min-w-0 flex-1">
//             <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-white/50">
//               Branch
//             </p>
//             <BranchSelect
//               value={selectedBranch}
//               onChange={(value) => setselectedBranch(value)}
//               className="w-full min-w-0 [&_*]:bg-transparent [&_*]:text-white [&_*]:font-semibold [&_*]:text-[13px] [&_*]:p-0 [&_*]:border-0"
//               options={branchOptions}
//             />
//           </div>
//         </div>

//         {/* Score board — kept as original */}
//         <div className="rounded-2xl bg-slate-950/70 px-3 py-2.5 shadow-inner ring-1 ring-white/[0.06]">
//           <div className="flex items-center justify-between">
//             <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
//               Score Board
//             </span>
//             <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-slate-400">
//               {normalizedCategories.length}
//             </span>
//           </div>

//           <div className="mt-1.5 flex items-center justify-between">
//             <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-200">
//               <LayoutGrid size={11} className="text-sky-400" />
//               Points
//             </span>
//             <span className="text-[16px] font-bold leading-none tracking-tight text-white">
//               {achievedPoints || 0}
//             </span>
//           </div>
//         </div>

//         {/* Select Period */}
//         <div className="rounded-2xl bg-white/[0.08] px-3 py-2.5">
//           <div className="mb-2 flex items-center gap-2">
//             <Clock3 size={13} className="text-white/70" />
//             <span className="text-[11px] font-semibold text-white/85">
//               Select Period
//             </span>
//           </div>

//           <div className="grid grid-cols-[minmax(0,1fr)_76px] gap-1.5">
//             <CustomSelect
//               value={localSelectedPeriod}
//               onChange={handlePeriodChange}
//               options={periodOptions}
//               className="min-w-0 w-full [&_*]:bg-white [&_*]:text-[#0a4a45] [&_*]:rounded-lg"
//               placeholder="Period"
//             />
//             <CustomSelect
//               value={selectedYear}
//               onChange={setSelectedYear}
//               options={yearOptions}
//               className="min-w-0 w-full [&_*]:bg-white [&_*]:text-[#0a4a45] [&_*]:rounded-lg"
//               placeholder="Year"
//             />
//           </div>
//         </div>

//         {/* Categories */}
//         <div className="rounded-2xl bg-white/[0.08] p-2">
//           <div className="mb-1.5 flex items-center justify-between px-1">
//             <span className="text-[11px] font-semibold text-white/85">
//               Categories
//             </span>
//             <button
//               type="button"
//               onClick={() => handleMoreClick && handleMoreClick()}
//               className="flex items-center gap-0.5 rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium text-white/80 transition-colors hover:bg-white/15"
//             >
//               View all
//               <ChevronRight size={11} />
//             </button>
//           </div>

//           <div className="rounded-xl bg-white/95 p-1">
//             {targetLoading ? (
//               <SkeletonTable rows={8} columns={2} />
//             ) : (
//               <CategoryListIconFirst
//                 categorylist={normalizedCategories}
//                 handleMoreClick={handleMoreClick}
//                 sidebarOpen={sidebarOpen}
//                 onCategoryClick={handleCategoryClick}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   )}
// </aside>
 

    
//     </>
//   )
// }



// export default Sidebar



// import React, { useEffect, useMemo, useState } from "react"
// import {
//   Menu,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
//   Clock3,
//   LayoutGrid,
//   Layers
// } from "lucide-react"
// import { CustomSelect } from "../common/CustomSelect"
// import CategoryListIconFirst from "./CategoryListIconFirst"

// const MONTH_NAME_TO_NUM = {
//   january: 1,
//   february: 2,
//   march: 3,
//   april: 4,
//   may: 5,
//   june: 6,
//   july: 7,
//   august: 8,
//   september: 9,
//   october: 10,
//   november: 11,
//   december: 12
// }

// const SHORT_MONTH_MAP = {
//   january: "Jan",
//   february: "Feb",
//   march: "Mar",
//   april: "Apr",
//   may: "May",
//   june: "Jun",
//   july: "Jul",
//   august: "Aug",
//   september: "Sep",
//   october: "Oct",
//   november: "Nov",
//   december: "Dec"
// }

// const Sidebar = ({
//   handleMoreClick,
//   targetData,
//   onselectedPeriodChange,
//   achievedPoints,
//   sidebarOpen,
//   toggleSidebar,
//   user,
//   selectedBranch,
//   setselectedBranch,
//   branchOptions,
//   categorylist,
//   targetLoading,
//   BranchSelect,
//   SkeletonTable,
//   selectedYear,
//   setSelectedYear,
//   onavataropenClick,
//   isMobile
// }) => {
//   const [localSelectedPeriod, setLocalSelectedPeriod] = useState(
//     targetData?.selectedPeriodName || ""
//   )

//   useEffect(() => {
//     setLocalSelectedPeriod(targetData?.selectedPeriodName || "")
//   }, [targetData?.selectedPeriodName])

//   const getShortMonth = (monthName = "") => {
//     const key = String(monthName).trim().toLowerCase()
//     return SHORT_MONTH_MAP[key] || String(monthName).slice(0, 3)
//   }

//   const getPeriodRange = (periodLabel) => {
//     if (!periodLabel) return null

//     const cleaned = String(periodLabel).trim()
//     const match = cleaned.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)\s+(\d{4})$/)
//     if (!match) return null

//     const [, startMonthName, endMonthName, year] = match
//     const startNum = MONTH_NAME_TO_NUM[startMonthName.toLowerCase()]
//     const endNum = MONTH_NAME_TO_NUM[endMonthName.toLowerCase()]

//     if (!startNum || !endNum) return null

//     return {
//       startNum,
//       endNum,
//       year: Number(year),
//       displayLabel: `${getShortMonth(startMonthName)} - ${getShortMonth(endMonthName)}`
//     }
//   }

//   const periodOptions = useMemo(() => {
//     return (targetData?.periods || []).map((period) => {
//       const parsed = getPeriodRange(period)
//       return {
//         value: period,
//         label: parsed?.displayLabel || String(period).replace(/\s+\d{4}$/, "")
//       }
//     })
//   }, [targetData?.periods])

//   const normalizedCategories = useMemo(() => {
//     return (categorylist || []).map((item) => {
//       const target = Number(item.targetamount || 0)
//       const achieved = Number(item.achievedamount || 0)
//       const percent = target > 0 ? Math.min((achieved / target) * 100, 100) : 0
//       return { ...item, target, achieved, percent }
//     })
//   }, [categorylist])

//   const yearOptions = useMemo(() => {
//     return Array.from({ length: 6 }, (_, i) => {
//       const year = new Date().getFullYear() - i
//       return { value: String(year), label: String(year) }
//     })
//   }, [])

//   const handlePeriodChange = (value) => {
//     setLocalSelectedPeriod(value)
//     const parsed = getPeriodRange(value)
//     const firstMonthNumber = parsed?.startNum || null
//     if (firstMonthNumber && onselectedPeriodChange) {
//       onselectedPeriodChange(value, firstMonthNumber)
//     }
//   }

//   const companyName = user?.activeCompany?.companyName || "CAMET"
//   const companyShort = companyName?.slice(0, 1)?.toUpperCase() || "C"
// console.log(sidebarOpen)
//   return (
//     <aside
//       className={`
//         flex h-full flex-col overflow-hidden border-r border-white/10
//         bg-gradient-to-b from-[#0d5c56] via-[#0f6c67] to-[#0a4a45] text-white
//         transition-[width] duration-300 ease-out lg:flex-shrink-0
//         ${sidebarOpen ? "w-full lg:w-[256px]" : "w-full lg:w-[64px]"}
//       `}
//     >
//       <div className="flex items-center justify-between px-2.5 py-2.5">
//         <div
//           className={`flex min-w-0 items-center gap-2.5 transition-opacity duration-200 ${
//             sidebarOpen ? "opacity-100" : "lg:opacity-0"
//           }`}
//         >
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold shadow-[0_4px_14px_rgba(56,189,248,0.35)]">
//             {companyShort}
//           </div>

//           <div className="min-w-0">
//             <div className="truncate text-[14px] font-bold leading-4">
//               {companyName}
//             </div>
//             <div className="text-[10px] uppercase tracking-[0.14em] text-white/60">
//               CRM
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={toggleSidebar}
//           className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/15"
//         >
//           {isMobile ? (
//             <Menu size={17} strokeWidth={2.2} />
//           ) : sidebarOpen ? (
//             <ChevronLeft size={16} />
//           ) : (
//             <ChevronRight size={16} />
//           )}
//         </button>
//       </div>

//       {sidebarOpen && (
//         <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-2.5 pb-2.5">
//           {/* Profile */}
//           <button
//             type="button"
//             onClick={onavataropenClick}
//             className="w-full rounded-2xl bg-white/[0.08] px-3 py-3 text-left transition hover:bg-white/[0.11]"
//           >
//             <div className="flex items-center gap-3">
//               <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/15">
//                 {user?.profileUrl ? (
//                   <img
//                     src={user.profileUrl}
//                     alt="Profile"
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center bg-[#083d43] text-lg font-bold text-white">
//                     {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                 )}
//                 <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-[#0f6c67] bg-emerald-400" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-[14px] font-bold leading-4">
//                   {user?.name || "User"}
//                 </p>
//                 <p className="mt-1 truncate text-[11px] text-white/60">
//                   {user?.role || user?.designation || "Member"}
//                 </p>
//               </div>
//             </div>
//           </button>

//           {/* Branch */}
//           <div className="rounded-2xl bg-white/[0.08] px-2.5 py-2.5">
//             <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium text-white/65">
//               <LayoutGrid size={13} />
//               Branch
//             </div>
//             <BranchSelect
//               value={selectedBranch}
//               onChange={setselectedBranch}
//               className="w-full min-w-0"
//               options={branchOptions}
//             />
//           </div>

//           {/* Score */}
//           <div className="rounded-2xl bg-slate-950/70 px-3 py-2.5 ring-1 ring-white/[0.06]">
//             <div className="flex items-center justify-between">
//               <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
//                 Score Board
//               </span>
//               <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-400">
//                 {normalizedCategories.length}
//               </span>
//             </div>

//             <div className="mt-1.5 flex items-center justify-between">
//               <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-200">
//                 <LayoutGrid size={11} className="text-sky-400" />
//                 Points
//               </span>
//               <span className="text-[16px] font-bold leading-none text-white">
//                 {achievedPoints || 0}
//               </span>
//             </div>
//           </div>

//           {/* Period */}
//           <div className="rounded-2xl bg-white/[0.08] px-2.5 py-2.5">
//             <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold text-white/85">
//               <Clock3 size={13} className="text-white/70" />
//               Select Period
//             </div>

//             <div className="grid grid-cols-[minmax(0,1fr)_76px] gap-1.5">
//               <CustomSelect
//                 value={localSelectedPeriod}
//                 onChange={handlePeriodChange}
//                 options={periodOptions}
//                 className="min-w-0 w-full"
//                 placeholder="Period"
//               />

//               <CustomSelect
//                 value={selectedYear}
//                 onChange={setSelectedYear}
//                 options={yearOptions}
//                 className="min-w-0 w-full"
//                 placeholder="Year"
//               />
//             </div>
//           </div>

//           {/* Categories */}
//           <div className="min-h-0 rounded-2xl bg-white/[0.08] p-2">
//             <div className="mb-2 flex items-center justify-between px-1">
//               <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/90">
//                 <Layers size={14} className="text-white/70" />
//                 Categories
//               </span>

//               <button
//                 type="button"
//                 onClick={() => handleMoreClick && handleMoreClick()}
//                 className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-medium text-white/75 transition hover:bg-white/15"
//               >
//                 View all
//               </button>
//             </div>

//             {targetLoading ? (
//               <SkeletonTable rows={8} columns={2} />
//             ) : (
//               <CategoryListIconFirst
//                 categorylist={normalizedCategories}
//                 handleMoreClick={handleMoreClick}
//                 sidebarOpen={sidebarOpen}
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </aside>
//   )
// }

// export default Sidebar


// import React, { useEffect, useMemo, useState } from "react"
// import {
//   Menu,
//   ChevronLeft,
//   ChevronRight,
//   Clock3,
//   LayoutGrid,
//   Layers,
//   Building2,
//   Trophy,
//   CalendarRange,
//   ChevronRight as ArrowRight
// } from "lucide-react"
// import { CustomSelect } from "../common/CustomSelect"

// const MONTH_NAME_TO_NUM = {
//   january: 1,
//   february: 2,
//   march: 3,
//   april: 4,
//   may: 5,
//   june: 6,
//   july: 7,
//   august: 8,
//   september: 9,
//   october: 10,
//   november: 11,
//   december: 12
// }

// const SHORT_MONTH_MAP = {
//   january: "Jan",
//   february: "Feb",
//   march: "Mar",
//   april: "Apr",
//   may: "May",
//   june: "Jun",
//   july: "Jul",
//   august: "Aug",
//   september: "Sep",
//   october: "Oct",
//   november: "Nov",
//   december: "Dec"
// }

// const CATEGORY_THEMES = [
//   {
//     icon: LayoutGrid,
//     iconWrap: "bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/15",
//     progress: "from-cyan-400 to-sky-500",
//     dot: "bg-cyan-400"
//   },
//   {
//     icon: Building2,
//     iconWrap: "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15",
//     progress: "from-emerald-400 to-teal-500",
//     dot: "bg-emerald-400"
//   },
//   {
//     icon: Trophy,
//     iconWrap: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/15",
//     progress: "from-amber-400 to-orange-500",
//     dot: "bg-amber-400"
//   }
// ]

// const formatAmount = (num = 0) => {
//   const n = Number(num || 0)
//   if (n >= 10000000) return `${(n / 10000000).toFixed(1)}CR`
//   if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
//   if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
//   return `${n}`
// }

// const getShortMonth = (monthName = "") => {
//   const key = String(monthName).trim().toLowerCase()
//   return SHORT_MONTH_MAP[key] || String(monthName).slice(0, 3)
// }

// const getPeriodRange = (periodLabel) => {
//   if (!periodLabel) return null
//   const cleaned = String(periodLabel).trim()
//   const match = cleaned.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)\s+(\d{4})$/)
//   if (!match) return null

//   const [, startMonthName, endMonthName, year] = match
//   const startNum = MONTH_NAME_TO_NUM[startMonthName.toLowerCase()]
//   const endNum = MONTH_NAME_TO_NUM[endMonthName.toLowerCase()]
//   if (!startNum || !endNum) return null

//   return {
//     startNum,
//     endNum,
//     year: Number(year),
//     displayLabel: `${getShortMonth(startMonthName)} - ${getShortMonth(endMonthName)}`
//   }
// }

// const SidebarBlock = ({ className = "", children }) => (
//   <div
//     className={`relative overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.05))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-md ${className}`}
//   >
//     <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
//     {children}
//   </div>
// )

// const CategoryCard = ({ item, index, onClick }) => {
//   const theme = CATEGORY_THEMES[index % CATEGORY_THEMES.length]
//   const Icon = theme.icon
//   const achieved = Number(item?.achievedamount || item?.achieved || 0)
//   const target = Number(item?.targetamount || item?.target || 0)
//   const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

//   return (
//     <button
//       type="button"
//       onClick={() => onClick?.(item?.categoryId, item?.categoryName)}
//       className="group flex w-full items-start gap-2.5 rounded-2xl border border-white/8 bg-[#081c23]/65 px-2.5 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.14)] transition duration-200 hover:-translate-y-[1px] hover:border-white/15 hover:bg-[#0a2129]/80"
//     >
//       <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${theme.iconWrap}`}>
//         <Icon size={15} strokeWidth={2.1} />
//       </div>

//       <div className="min-w-0 flex-1">
//         <div className="flex items-start justify-between gap-2">
//           <div className="min-w-0">
//             <div
//               className="truncate text-[12.5px] font-semibold leading-4 text-white"
//               title={item?.categoryName}
//             >
//               {item?.categoryName}
//             </div>
//             <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/45">
//               <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
//               Target {formatAmount(target)}
//             </div>
//           </div>

//           <ArrowRight
//             size={14}
//             className="mt-0.5 shrink-0 text-white/25 transition group-hover:text-white/55"
//           />
//         </div>

//         <div className="mt-2 flex items-center gap-2">
//           <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/8">
//             <div
//               className={`h-full rounded-full bg-gradient-to-r ${theme.progress}`}
//               style={{ width: `${percentage}%` }}
//             />
//           </div>

//           <div className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold text-white/75">
//             {percentage.toFixed(0)}%
//           </div>

//           <div className="shrink-0 text-[11px] font-bold tracking-tight text-white">
//             {formatAmount(achieved)}
//           </div>
//         </div>
//       </div>
//     </button>
//   )
// }

// const CategoryListIconFirst = ({ categorylist, handleMoreClick, sidebarOpen }) => {
//   return (
//     <div
//       className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5 ${
//         sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
//       }`}
//     >
//       <div className="space-y-2">
//         {categorylist?.length ? (
//           categorylist.map((item, index) => (
//             <CategoryCard
//               key={`${item.categoryId || item.categoryName}-${index}`}
//               item={item}
//               index={index}
//               onClick={(categoryId) => handleMoreClick?.(categoryId)}
//             />
//           ))
//         ) : (
//           <div className="rounded-2xl border border-dashed border-white/10 bg-[#081c23]/45 px-3 py-7 text-center text-[12px] text-white/45">
//             No categories available
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const Sidebar = ({
//   handleMoreClick,
//   targetData,
//   onselectedPeriodChange,
//   achievedPoints,
//   sidebarOpen,
//   toggleSidebar,
//   user,
//   selectedBranch,
//   setselectedBranch,
//   branchOptions,
//   categorylist,
//   targetLoading,
//   BranchSelect,
//   SkeletonTable,
//   selectedYear,
//   setSelectedYear,
//   onavataropenClick,
//   isMobile
// }) => {
//   const [localSelectedPeriod, setLocalSelectedPeriod] = useState(
//     targetData?.selectedPeriodName || ""
//   )

//   useEffect(() => {
//     setLocalSelectedPeriod(targetData?.selectedPeriodName || "")
//   }, [targetData?.selectedPeriodName])

//   const normalizedCategories = useMemo(() => {
//     return (categorylist || []).map((item) => {
//       const target = Number(item.targetamount || 0)
//       const achieved = Number(item.achievedamount || 0)
//       const percent = target > 0 ? Math.min((achieved / target) * 100, 100) : 0
//       return { ...item, target, achieved, percent }
//     })
//   }, [categorylist])

//   const periodOptions = useMemo(() => {
//     return (targetData?.periods || []).map((period) => {
//       const parsed = getPeriodRange(period)
//       return {
//         value: period,
//         label: parsed?.displayLabel || String(period).replace(/\s+\d{4}$/, "")
//       }
//     })
//   }, [targetData?.periods])

//   const yearOptions = useMemo(() => {
//     return Array.from({ length: 6 }, (_, i) => {
//       const year = new Date().getFullYear() - i
//       return { value: String(year), label: String(year) }
//     })
//   }, [])

//   const handlePeriodChange = (value) => {
//     setLocalSelectedPeriod(value)
//     const parsed = getPeriodRange(value)
//     const firstMonthNumber = parsed?.startNum || null
//     if (firstMonthNumber && onselectedPeriodChange) {
//       onselectedPeriodChange(value, firstMonthNumber)
//     }
//   }

//   const companyName = user?.activeCompany?.companyName || "CAMET"
//   const companyShort = companyName?.slice(0, 1)?.toUpperCase() || "C"

//   return (
//     <aside
//       className={`
//         relative flex h-full flex-col overflow-hidden border-r border-white/10 text-white
//         bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_26%),linear-gradient(180deg,#0d3a41_0%,#0a2f35_45%,#08262d_100%)]
//         shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]
//         transition-[width] duration-300 ease-out lg:flex-shrink-0
//         ${sidebarOpen ? "w-full lg:w-[228px]" : "w-full lg:w-[64px]"}
//       `}
//     >
//       <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_26%,transparent_72%,rgba(255,255,255,0.03))]" />
//       <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-white/10" />

//       <div className="relative flex items-center justify-between px-2 py-2">
//         <div
//           className={`flex min-w-0 items-center gap-2 transition-opacity duration-200 ${
//             sidebarOpen ? "opacity-100" : "lg:opacity-0"
//           }`}
//         >
//           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-[linear-gradient(180deg,rgba(56,189,248,0.26),rgba(37,99,235,0.22))] text-[13px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_rgba(2,132,199,0.22)]">
//             {companyShort}
//           </div>

//           <div className="min-w-0">
//             <div className="truncate text-[13px] font-bold leading-4 text-white/95">
//               {companyName}
//             </div>
//             <div className="text-[9px] uppercase tracking-[0.18em] text-white/45">
//               CRM
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={toggleSidebar}
//           className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/[0.10]"
//         >
//           {isMobile ? (
//             <Menu size={17} strokeWidth={2.2} />
//           ) : sidebarOpen ? (
//             <ChevronLeft size={16} />
//           ) : (
//             <ChevronRight size={16} />
//           )}
//         </button>
//       </div>

//       {sidebarOpen && (
//         <div className="relative min-h-0 flex-1 space-y-2 overflow-y-auto px-2 pb-2">
//           {/* Profile */}
//           <SidebarBlock className="px-2.5 py-2.5">
//             <button
//               type="button"
//               onClick={onavataropenClick}
//               className="flex w-full items-center gap-2.5 text-left"
//             >
//               <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-[#0a2129] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
//                 {user?.profileUrl ? (
//                   <img
//                     src={user.profileUrl}
//                     alt="Profile"
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
//                     {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                 )}
//                 <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-[#0d3a41] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <div className="truncate text-[13px] font-semibold leading-4 text-white">
//                   {user?.name || "User"}
//                 </div>
//                 <div className="mt-0.5 truncate text-[10px] text-white/50">
//                   {user?.role || user?.designation || "Member"}
//                 </div>
//               </div>
//             </button>
//           </SidebarBlock>

//           {/* Compact utility row */}
//           <div className="grid grid-cols-2 gap-2">
//             <SidebarBlock className="px-2 py-2">
//               <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/55">
//                 <Building2 size={12} />
//                 Branch
//               </div>
//               <div className="mt-1">
//                 <BranchSelect
//                   value={selectedBranch}
//                   onChange={setselectedBranch}
//                   className="w-full min-w-0"
//                   options={branchOptions}
//                 />
//               </div>
//             </SidebarBlock>

//             <SidebarBlock className="px-2 py-2">
//               <div className="flex items-center justify-between">
//                 <div className="text-[10px] font-medium text-white/55">Score</div>
//                 <div className="rounded-full border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[8px] text-white/45">
//                   {normalizedCategories.length}
//                 </div>
//               </div>
//               <div className="mt-1.5 flex items-end justify-between">
//                 <div className="text-[10px] text-white/50">Points</div>
//                 <div className="text-[15px] font-bold leading-none text-white">
//                   {achievedPoints || 0}
//                 </div>
//               </div>
//             </SidebarBlock>
//           </div>

//           {/* Period compact */}
//           <SidebarBlock className="px-2 py-2">
//             <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-white/60">
//               <CalendarRange size={12} />
//               Period
//             </div>

//             <div className="grid grid-cols-[minmax(0,1fr)_70px] gap-1.5">
//               <CustomSelect
//                 value={localSelectedPeriod}
//                 onChange={handlePeriodChange}
//                 options={periodOptions}
//                 className="min-w-0 w-full"
//                 placeholder="Period"
//               />
//               <CustomSelect
//                 value={selectedYear}
//                 onChange={setSelectedYear}
//                 options={yearOptions}
//                 className="min-w-0 w-full"
//                 placeholder="Year"
//               />
//             </div>
//           </SidebarBlock>

//           {/* Categories */}
//           <SidebarBlock className="min-h-0 flex flex-1 flex-col p-2">
//             <div className="mb-2 flex items-center justify-between px-0.5">
//               <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/88">
//                 <Layers size={13} className="text-white/65" />
//                 Categories
//               </div>

//               <button
//                 type="button"
//                 onClick={() => handleMoreClick?.()}
//                 className="rounded-xl border border-white/10 bg-white/[0.05] px-2 py-1 text-[9px] font-medium text-white/70 transition hover:bg-white/[0.09]"
//               >
//                 View all
//               </button>
//             </div>

//             {targetLoading ? (
//               <SkeletonTable rows={10} columns={2} />
//             ) : (
//               <CategoryListIconFirst
//                 categorylist={normalizedCategories}
//                 handleMoreClick={handleMoreClick}
//                 sidebarOpen={sidebarOpen}
//               />
//             )}
//           </SidebarBlock>
//         </div>
//       )}
//     </aside>
//   )
// }

// export default Sidebar









// import React, { useEffect, useMemo, useState } from "react"
// import {
//   Menu,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
//   LayoutGrid,
//   Layers,
//   Building2,
//   Trophy,
//   CalendarRange,
//   Bell,
//   MoreVertical,
//   Users,
//   CircleDollarSign,
//   Boxes,
//   CheckCircle2
// } from "lucide-react"
// import { CustomSelect } from "../common/CustomSelect"
// const MONTH_NAME_TO_NUM = {
//   january: 1,
//   february: 2,
//   march: 3,
//   april: 4,
//   may: 5,
//   june: 6,
//   july: 7,
//   august: 8,
//   september: 9,
//   october: 10,
//   november: 11,
//   december: 12
// }

// const SHORT_MONTH_MAP = {
//   january: "Jan",
//   february: "Feb",
//   march: "Mar",
//   april: "Apr",
//   may: "May",
//   june: "Jun",
//   july: "Jul",
//   august: "Aug",
//   september: "Sep",
//   october: "Oct",
//   november: "Nov",
//   december: "Dec"
// }

// const CATEGORY_STYLES = [
//   {
//     icon: Users,
//     iconWrap: "bg-[#E9F7EC] text-[#2FA84F]",
//     progress: "bg-[#2FA84F]",
//     progressBg: "bg-[#E7E9EC]",
//     badge: "bg-[#E9F7EC] text-[#2FA84F]"
//   },
//   {
//     icon: Building2,
//     iconWrap: "bg-[#EAF1FF] text-[#2D7EF7]",
//     progress: "bg-[#2D7EF7]",
//     progressBg: "bg-[#E7E9EC]",
//     badge: "bg-[#EAF1FF] text-[#2D7EF7]"
//   },
//   {
//     icon: CircleDollarSign,
//     iconWrap: "bg-[#FFF2DF] text-[#F2A11A]",
//     progress: "bg-[#F2A11A]",
//     progressBg: "bg-[#E7E9EC]",
//     badge: "bg-[#FFF2DF] text-[#D98B10]"
//   },
//   {
//     icon: Trophy,
//     iconWrap: "bg-[#F2EAFE] text-[#8A56E8]",
//     progress: "bg-[#8A56E8]",
//     progressBg: "bg-[#E7E9EC]",
//     badge: "bg-[#F2EAFE] text-[#8A56E8]"
//   },
//   {
//     icon: Boxes,
//     iconWrap: "bg-[#FDEBED] text-[#E25263]",
//     progress: "bg-[#E25263]",
//     progressBg: "bg-[#E7E9EC]",
//     badge: "bg-[#FDEBED] text-[#D94B5C]"
//   }
// ]

// const SCORE_ITEMS = [
//   { label: "Leads", valueKey: "leads", fallback: 128, icon: Users, color: "text-[#69DB7C]" },
//   { label: "Customers", valueKey: "customers", fallback: 76, icon: Building2, color: "text-[#4DABF7]" },
//   { label: "Deals", valueKey: "deals", fallback: 42, icon: CircleDollarSign, color: "text-[#FFC857]" },
//   { label: "Won Deals", valueKey: "wonDeals", fallback: 18, icon: CheckCircle2, color: "text-[#B197FC]" }
// ]

// const formatAmount = (num = 0) => {
//   const n = Number(num || 0)
//   if (n >= 10000000) return `${(n / 10000000).toFixed(1)}CR`
//   if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
//   if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
//   return `${n}`
// }

// const getShortMonth = (monthName = "") => {
//   const key = String(monthName).trim().toLowerCase()
//   return SHORT_MONTH_MAP[key] || String(monthName).slice(0, 3)
// }

// const getPeriodRange = (periodLabel) => {
//   if (!periodLabel) return null
//   const cleaned = String(periodLabel).trim()
//   const match = cleaned.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)\s+(\d{4})$/)
//   if (!match) return null

//   const [, startMonthName, endMonthName, year] = match
//   const startNum = MONTH_NAME_TO_NUM[startMonthName.toLowerCase()]
//   const endNum = MONTH_NAME_TO_NUM[endMonthName.toLowerCase()]
//   if (!startNum || !endNum) return null

//   return {
//     startNum,
//     endNum,
//     year: Number(year),
//     displayLabel: `${getShortMonth(startMonthName)} - ${getShortMonth(endMonthName)}`
//   }
// }

// const GlassCard = ({ className = "", children, dark = false }) => (
//   <div
//     className={[
//       "relative overflow-hidden rounded-[22px] border",
//       dark
//         ? "border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(21,255,217,0.08),transparent_28%),linear-gradient(180deg,rgba(4,27,33,0.97),rgba(2,20,26,0.96))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_30px_rgba(0,0,0,0.24)]"
//         : "border-white/12 bg-[linear-gradient(180deg,rgba(20,140,148,0.34),rgba(10,112,119,0.28))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_26px_rgba(0,0,0,0.14)] backdrop-blur-md",
//       className
//     ].join(" ")}
//   >
//     <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
//     {children}
//   </div>
// )

// const CategoryCardCompact = ({ item, index, onClick }) => {
//   const scheme = CATEGORY_STYLES[index % CATEGORY_STYLES.length]
//   const Icon = scheme.icon
//   const achieved = Number(item?.achievedamount || 0)
//   const target = Number(item?.targetamount || 0)
//   const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

//   return (
//     <button
//       type="button"
//       onClick={() => onClick?.(item?.categoryId)}
//       className="flex w-full items-center gap-3 rounded-[16px] border border-black/5 bg-white px-3 py-3 text-left shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition hover:-translate-y-[1px]"
//     >
//       <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${scheme.iconWrap}`}>
//         <Icon size={18} strokeWidth={2.1} />
//       </div>

//       <div className="min-w-0 flex-1">
//         <div className="flex items-center justify-between gap-2">
//           <div className="truncate text-[13px] font-semibold text-slate-900">
//             {item?.categoryName}
//           </div>
//           <div className={`rounded-full px-2 py-1 text-[10px] font-bold ${scheme.badge}`}>
//             {percentage.toFixed(0)}%
//           </div>
//         </div>

//         <div className="mt-2 flex items-center gap-3">
//           <div className={`h-1.5 min-w-0 flex-1 overflow-hidden rounded-full ${scheme.progressBg}`}>
//             <div
//               className={`h-full rounded-full ${scheme.progress}`}
//               style={{ width: `${percentage}%` }}
//             />
//           </div>
//           <div className="min-w-[28px] text-right text-[12px] font-bold text-slate-900">
//             {formatAmount(achieved)}
//           </div>
//           <ChevronRight size={16} className="shrink-0 text-slate-400" />
//         </div>
//       </div>
//     </button>
//   )
// }

// const CategoryListIconFirst = ({ categorylist, handleMoreClick, sidebarOpen }) => {
//   return (
//     <div
//       className={`min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden pr-1 ${
//         sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
//       }`}
//     >
//       <div className="space-y-2.5">
//         {categorylist?.length ? (
//           categorylist.map((item, index) => (
//             <CategoryCardCompact
//               key={`${item.categoryId || item.categoryName}-${index}`}
//               item={item}
//               index={index}
//               onClick={handleMoreClick}
//             />
//           ))
//         ) : (
//           <div className="rounded-[18px] border border-dashed border-white/15 bg-white/5 px-3 py-6 text-center text-[12px] text-white/60">
//             No categories available
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const Sidebar = ({
//   handleMoreClick,
//   targetData,
//   onselectedPeriodChange,
//   achievedPoints,
//   sidebarOpen,
//   toggleSidebar,
//   user,
//   selectedBranch,
//   setselectedBranch,
//   branchOptions,
//   categorylist,
//   targetLoading,
//   BranchSelect,
//   SkeletonTable,
//   selectedYear,
//   setSelectedYear,
//   onavataropenClick,
//   isMobile,
//   notificationCount = 3
// }) => {
//   const [localSelectedPeriod, setLocalSelectedPeriod] = useState(
//     targetData?.selectedPeriodName || ""
//   )

//   useEffect(() => {
//     setLocalSelectedPeriod(targetData?.selectedPeriodName || "")
//   }, [targetData?.selectedPeriodName])

//   const normalizedCategories = useMemo(() => {
//     return (categorylist || []).map((item) => {
//       const target = Number(item.targetamount || 0)
//       const achieved = Number(item.achievedamount || 0)
//       const percent = target > 0 ? Math.min((achieved / target) * 100, 100) : 0
//       return { ...item, target, achieved, percent }
//     })
//   }, [categorylist])

//   const periodOptions = useMemo(() => {
//     return (targetData?.periods || []).map((period) => {
//       const parsed = getPeriodRange(period)
//       return {
//         value: period,
//         label: parsed?.displayLabel || String(period).replace(/\s+\d{4}$/, "")
//       }
//     })
//   }, [targetData?.periods])

//   const yearOptions = useMemo(() => {
//     return Array.from({ length: 6 }, (_, i) => {
//       const year = new Date().getFullYear() - i
//       return { value: String(year), label: String(year) }
//     })
//   }, [])

//   const handlePeriodChange = (value) => {
//     setLocalSelectedPeriod(value)
//     const parsed = getPeriodRange(value)
//     const firstMonthNumber = parsed?.startNum || null
//     if (firstMonthNumber && onselectedPeriodChange) {
//       onselectedPeriodChange(value, firstMonthNumber)
//     }
//   }

//   const companyName = user?.activeCompany?.companyName || "CAMET"
//   const companyShort = companyName?.slice(0, 1)?.toUpperCase() || "C"

//   return (
//     <aside
//       className={`
//         relative flex h-full flex-col overflow-hidden text-white
//         bg-[radial-gradient(circle_at_top_left,rgba(29,233,240,0.12),transparent_24%),linear-gradient(180deg,#005B63_0%,#005159_45%,#004851_100%)]
//         transition-[width] duration-300 ease-out lg:flex-shrink-0
//         ${sidebarOpen ? "w-full lg:w-[380px]" : "w-full lg:w-[72px]"}
//       `}
//     >
//       <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_28%,transparent_74%,rgba(255,255,255,0.025))]" />

//       <div className="relative flex h-full flex-col px-4 py-4">
//         <div className="flex items-center justify-between">
//           <div
//             className={`flex min-w-0 items-center gap-3 transition-opacity duration-200 ${
//               sidebarOpen ? "opacity-100" : "lg:opacity-0"
//             }`}
//           >
//             <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#3D8BFF_0%,#0D5DF5_100%)] text-[28px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_rgba(0,0,0,0.2)]">
//               {companyShort}
//             </div>

//             <div className="min-w-0">
//               <div className="truncate text-[16px] font-extrabold leading-5 text-white">
//                 {companyName}
//               </div>
//               <div className="text-[10px] uppercase tracking-[0.15em] text-white/70">
//                 CRM
//               </div>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={toggleSidebar}
//             className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_18px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:bg-white/15"
//           >
//             {isMobile ? (
//               <Menu size={24} strokeWidth={2.2} />
//             ) : sidebarOpen ? (
//               <ChevronLeft size={22} />
//             ) : (
//               <ChevronRight size={22} />
//             )}
//           </button>
//         </div>

//         {sidebarOpen && (
//           <div className="mt-5 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
//             <GlassCard className="px-4 py-4">
//               <button
//                 type="button"
//                 onClick={onavataropenClick}
//                 className="flex w-full items-center gap-4 text-left"
//               >
//                 <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-full bg-white/10 ring-2 ring-white/15">
//                   {user?.profileUrl ? (
//                     <img
//                       src={user.profileUrl}
//                       alt="Profile"
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <div className="flex h-full w-full items-center justify-center bg-[#0A5560] text-[28px] font-bold text-white">
//                       {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                     </div>
//                   )}
//                   <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#0C6B73] bg-[#38D77A]" />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <div className="truncate text-[16px] font-bold text-white">
//                     {user?.name || "User"}
//                   </div>
//                   <div className="mt-1 truncate text-[12px] text-white/80">
//                     {user?.role || user?.designation || "Administrator"}
//                   </div>
//                 </div>

//                 <ChevronRight size={24} className="shrink-0 text-white/90" />
//               </button>
//             </GlassCard>

//             <GlassCard className="px-3.5 py-3">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
//                   <Building2 size={20} className="text-white" />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <div className="text-[11px] text-white/80">Branch</div>
//                   <BranchSelect
//                     value={selectedBranch}
//                     onChange={setselectedBranch}
//                     className="w-full min-w-0 sidebar-image-select"
//                     options={branchOptions}
//                   />
//                 </div>

//                 <ChevronDown size={20} className="shrink-0 text-white" />
//               </div>
//             </GlassCard>

//             <GlassCard dark className="px-3.5 py-4">
//               <div className="mb-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2.5">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0B434B] text-[#31D3C6]">
//                     <LayoutGrid size={17} />
//                   </div>
//                   <div className="text-[14px] font-semibold text-[#4BE0D4]">
//                     Scoreboard
//                   </div>
//                 </div>

//                 <MoreVertical size={17} className="text-white/80" />
//               </div>

//               <div className="grid grid-cols-4 gap-1">
//                 {SCORE_ITEMS.map((stat, idx) => {
//                   const Icon = stat.icon
//                   const statValue = idx === 0 ? achievedPoints || stat.fallback : stat.fallback

//                   return (
//                     <div
//                       key={stat.label}
//                       className={`px-2 text-center ${idx !== SCORE_ITEMS.length - 1 ? "border-r border-white/10" : ""}`}
//                     >
//                       <Icon size={19} className={`mx-auto mb-2.5 ${stat.color}`} />
//                       <div className="text-[14px] font-extrabold text-white">
//                         {statValue}
//                       </div>
//                       <div className="mt-1 text-[10px] text-white/85">
//                         {stat.label}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </GlassCard>

//             <GlassCard className="px-3.5 py-3.5">
//               <div className="mb-3 flex items-center gap-2 text-white">
//                 <CalendarRange size={18} />
//                 <span className="text-[14px] font-semibold">Select Period</span>
//               </div>

//               <div className="grid grid-cols-[minmax(0,1fr)_112px] gap-2.5">
//                 <CustomSelect
//                   value={localSelectedPeriod}
//                   onChange={handlePeriodChange}
//                   options={periodOptions}
//                   className="w-full min-w-0 sidebar-image-select sidebar-image-select--white"
//                   placeholder="Period"
//                 />
//                 <CustomSelect
//                   value={selectedYear}
//                   onChange={setSelectedYear}
//                   options={yearOptions}
//                   className="w-full min-w-0 sidebar-image-select sidebar-image-select--white"
//                   placeholder="Year"
//                 />
//               </div>
//             </GlassCard>

//             <GlassCard className="min-h-0 flex flex-1 flex-col px-3 py-3">
//               <div className="mb-3 flex items-center justify-between px-1">
//                 <div className="inline-flex items-center gap-2 text-white">
//                   <Layers size={18} />
//                   <span className="text-[14px] font-semibold">Categories</span>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => handleMoreClick?.()}
//                   className="rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white"
//                 >
//                   View All
//                 </button>
//               </div>

//               {targetLoading ? (
//                 <SkeletonTable rows={5} columns={2} />
//               ) : (
//                 <CategoryListIconFirst
//                   categorylist={normalizedCategories}
//                   handleMoreClick={handleMoreClick}
//                   sidebarOpen={sidebarOpen}
//                 />
//               )}
//             </GlassCard>

//             <GlassCard className="px-4 py-3">
//               <button
//                 type="button"
//                 className="flex w-full items-center justify-between text-left"
//               >
//                 <div className="flex items-center gap-3 text-white">
//                   <Bell size={19} />
//                   <span className="text-[14px] font-medium">Notifications</span>
//                   <span className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-[#18C6CF] px-2 text-[12px] font-bold text-white">
//                     {notificationCount}
//                   </span>
//                 </div>
//                 <ChevronRight size={18} className="text-white/90" />
//               </button>
//             </GlassCard>
//           </div>
//         )}
//       </div>
//     </aside>
//   )
// }

// export default Sidebar



// import React, { useEffect, useMemo, useState } from "react"
// import {
//   Menu,
//   ChevronLeft,
//   ChevronRight,
//   Clock3,
//   LayoutGrid,
//   Layers,
//   Building2,
//   Trophy,
//   CalendarRange,
//   ChevronDown,
//   ChevronRight as ArrowRight,
//   Bell,
//   Users,
//   BadgeDollarSign,
//   CheckCircle2
// } from "lucide-react"
// import { CustomSelect } from "../common/CustomSelect"
// const MONTH_NAME_TO_NUM = {
//   january: 1,
//   february: 2,
//   march: 3,
//   april: 4,
//   may: 5,
//   june: 6,
//   july: 7,
//   august: 8,
//   september: 9,
//   october: 10,
//   november: 11,
//   december: 12
// }

// const SHORT_MONTH_MAP = {
//   january: "Jan",
//   february: "Feb",
//   march: "Mar",
//   april: "Apr",
//   may: "May",
//   june: "Jun",
//   july: "Jul",
//   august: "Aug",
//   september: "Sep",
//   october: "Oct",
//   november: "Nov",
//   december: "Dec"
// }

// const CATEGORY_THEMES = [
//   {
//     icon: Users,
//     softBg: "bg-emerald-50",
//     iconColor: "text-emerald-500",
//     progress: "from-emerald-400 to-green-500",
//     pill: "bg-emerald-50 text-emerald-600"
//   },
//   {
//     icon: Building2,
//     softBg: "bg-blue-50",
//     iconColor: "text-blue-500",
//     progress: "from-blue-400 to-blue-600",
//     pill: "bg-blue-50 text-blue-600"
//   },
//   {
//     icon: BadgeDollarSign,
//     softBg: "bg-amber-50",
//     iconColor: "text-amber-500",
//     progress: "from-amber-400 to-orange-500",
//     pill: "bg-amber-50 text-amber-600"
//   },
//   {
//     icon: Trophy,
//     softBg: "bg-violet-50",
//     iconColor: "text-violet-500",
//     progress: "from-violet-400 to-purple-500",
//     pill: "bg-violet-50 text-violet-600"
//   },
//   {
//     icon: CheckCircle2,
//     softBg: "bg-rose-50",
//     iconColor: "text-rose-500",
//     progress: "from-rose-400 to-red-500",
//     pill: "bg-rose-50 text-rose-600"
//   }
// ]

// const formatAmount = (num = 0) => {
//   const n = Number(num || 0)
//   return `${n}`
// }

// const getShortMonth = (monthName = "") => {
//   const key = String(monthName).trim().toLowerCase()
//   return SHORT_MONTH_MAP[key] || String(monthName).slice(0, 3)
// }

// const getPeriodRange = (periodLabel) => {
//   if (!periodLabel) return null
//   const cleaned = String(periodLabel).trim()
//   const match = cleaned.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)\s+(\d{4})$/)
//   if (!match) return null

//   const [, startMonthName, endMonthName, year] = match
//   const startNum = MONTH_NAME_TO_NUM[startMonthName.toLowerCase()]
//   const endNum = MONTH_NAME_TO_NUM[endMonthName.toLowerCase()]
//   if (!startNum || !endNum) return null

//   return {
//     startNum,
//     endNum,
//     year: Number(year),
//     displayLabel: `${getShortMonth(startMonthName)} - ${getShortMonth(endMonthName)}`
//   }
// }

// const sidebarShell =
//   "relative overflow-visible rounded-[26px] bg-[radial-gradient(circle_at_top_left,rgba(18,143,142,0.36),transparent_28%),linear-gradient(180deg,#035c63_0%,#04575e_30%,#045058_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.08),0_22px_45px_rgba(0,68,74,0.22)]"

// const glassCard =
//   "relative overflow-visible rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_24px_rgba(0,49,53,0.16)]"

// const darkCard =
//   "relative overflow-visible rounded-[22px] bg-[linear-gradient(180deg,#033a40_0%,#032f34_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_14px_28px_rgba(0,33,36,0.24)]"

// const SidebarBlock = ({ className = "", children }) => (
//   <div className={`${glassCard} ${className}`}>{children}</div>
// )

// const ScoreMetric = ({ icon, value, label, colorClass }) => {
//   const Icon = icon
//   return (
//     <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-2">
//       <Icon size={22} className={colorClass} strokeWidth={2.1} />
//       <div className="mt-2 text-[16px] font-bold leading-none text-white">{value}</div>
//       <div className="mt-1 text-[10px] text-white/75">{label}</div>
//     </div>
//   )
// }

// const CategoryCard = ({ item, index, onClick }) => {
//   const theme = CATEGORY_THEMES[index % CATEGORY_THEMES.length]
//   const Icon = theme.icon
//   const achieved = Number(item?.achievedamount || item?.achieved || 0)
//   const target = Number(item?.targetamount || item?.target || 0)
//   const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

//   return (
//     <button
//       type="button"
//       onClick={() => onClick?.(item?.categoryId, item?.categoryName)}
//       className="group flex w-full items-center gap-3 rounded-[18px] bg-white px-3 py-3 text-left shadow-[0_10px_20px_rgba(3,58,64,0.10)] transition duration-200 hover:-translate-y-[1px]"
//     >
//       <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${theme.softBg}`}>
//         <Icon size={19} className={theme.iconColor} strokeWidth={2.1} />
//       </div>

//       <div className="min-w-0 flex-1">
//         <div className="flex items-center justify-between gap-2">
//           <div className="truncate text-[13px] font-semibold text-slate-800">
//             {item?.categoryName}
//           </div>
//           <div className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${theme.pill}`}>
//             {percentage.toFixed(0)}%
//           </div>
//         </div>

//         <div className="mt-2 flex items-center gap-3">
//           <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200">
//             <div
//               className={`h-full rounded-full bg-gradient-to-r ${theme.progress}`}
//               style={{ width: `${percentage}%` }}
//             />
//           </div>
//           <div className="text-[12px] font-bold text-slate-800">{formatAmount(achieved)}</div>
//           <ArrowRight size={15} className="text-slate-400" />
//         </div>
//       </div>
//     </button>
//   )
// }

// const CategoryListIconFirst = ({ categorylist, handleMoreClick, sidebarOpen }) => {
//   return (
//     <div
//       className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5 ${
//         sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
//       }`}
//     >
//       <div className="space-y-2.5">
//         {categorylist?.length ? (
//           categorylist.map((item, index) => (
//             <CategoryCard
//               key={`${item.categoryId || item.categoryName}-${index}`}
//               item={item}
//               index={index}
//               onClick={(categoryId) => handleMoreClick?.(categoryId)}
//             />
//           ))
//         ) : (
//           <div className="rounded-[18px] bg-white/95 px-3 py-6 text-center text-[12px] text-slate-500">
//             No categories available
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const Sidebar = ({
//   handleMoreClick,
//   targetData,
//   onselectedPeriodChange,
//   achievedPoints,
//   sidebarOpen,
//   toggleSidebar,
//   user,
//   selectedBranch,
//   setselectedBranch,
//   branchOptions,
//   categorylist,
//   targetLoading,
//   BranchSelect,
//   SkeletonTable,
//   selectedYear,
//   setSelectedYear,
//   onavataropenClick,
//   isMobile,
//   CustomSelect
// }) => {
//   const [localSelectedPeriod, setLocalSelectedPeriod] = useState(
//     targetData?.selectedPeriodName || ""
//   )

//   useEffect(() => {
//     setLocalSelectedPeriod(targetData?.selectedPeriodName || "")
//   }, [targetData?.selectedPeriodName])

//   const normalizedCategories = useMemo(() => {
//     return (categorylist || []).map((item) => {
//       const target = Number(item.targetamount || 0)
//       const achieved = Number(item.achievedamount || 0)
//       const percent = target > 0 ? Math.min((achieved / target) * 100, 100) : 0
//       return { ...item, target, achieved, percent }
//     })
//   }, [categorylist])

//   const periodOptions = useMemo(() => {
//     return (targetData?.periods || []).map((period) => {
//       const parsed = getPeriodRange(period)
//       return {
//         value: period,
//         label: parsed?.displayLabel || String(period).replace(/\s+\d{4}$/, "")
//       }
//     })
//   }, [targetData?.periods])

//   const yearOptions = useMemo(() => {
//     return Array.from({ length: 6 }, (_, i) => {
//       const year = new Date().getFullYear() - i
//       return { value: String(year), label: String(year) }
//     })
//   }, [])

//   const handlePeriodChange = (value) => {
//     setLocalSelectedPeriod(value)
//     const parsed = getPeriodRange(value)
//     const firstMonthNumber = parsed?.startNum || null
//     if (firstMonthNumber && onselectedPeriodChange) {
//       onselectedPeriodChange(value, firstMonthNumber)
//     }
//   }

//   const companyName = user?.activeCompany?.companyName || "CAMET CRM"
//   const companyShort = companyName?.slice(0, 1)?.toUpperCase() || "C"

//   return (
//     <aside
//       className={`
//         ${sidebarShell}
//         flex h-full flex-col text-white transition-[width] duration-300 ease-out lg:flex-shrink-0
//         ${sidebarOpen ? "w-full lg:w-[228px]" : "w-full lg:w-[64px]"}
//       `}
//     >
//       <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%,transparent_72%,rgba(255,255,255,0.03))]" />

//       <div className="relative flex items-center justify-between px-3 pt-3 pb-2">
//         <div
//           className={`flex min-w-0 items-center gap-3 transition-opacity duration-200 ${
//             sidebarOpen ? "opacity-100" : "lg:opacity-0"
//           }`}
//         >
//           <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2f8dff_0%,#1c5fe8_100%)] text-[20px] font-bold text-white shadow-[0_10px_22px_rgba(28,95,232,0.35)]">
//             {companyShort}
//           </div>

//           <div className="min-w-0">
//             <div className="truncate text-[15px] font-bold tracking-tight text-white">
//               {companyName}
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={toggleSidebar}
//           className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_18px_rgba(0,46,50,0.16)] transition hover:scale-[1.02]"
//         >
//           {isMobile ? (
//             <Menu size={21} strokeWidth={2.2} />
//           ) : sidebarOpen ? (
//             <ChevronLeft size={18} />
//           ) : (
//             <ChevronRight size={18} />
//           )}
//         </button>
//       </div>

//       {sidebarOpen && (
//         <div className="relative min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-3">
//           {/* Profile */}
//           <SidebarBlock className="px-3 py-3.5">
//             <button
//               type="button"
//               onClick={onavataropenClick}
//               className="flex w-full items-center gap-3 text-left"
//             >
//               <div className="relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
//                 {user?.profileUrl ? (
//                   <img
//                     src={user.profileUrl}
//                     alt="Profile"
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-700">
//                     {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                 )}
//                 <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <div className="truncate text-[14px] font-bold text-white">
//                   {user?.name || "Arjun Mehta"}
//                 </div>
//                 <div className="mt-1 truncate text-[11px] text-white/70">
//                   {user?.role || user?.designation || "Administrator"}
//                 </div>
//               </div>

//               <ChevronRight size={20} className="shrink-0 text-white/85" />
//             </button>
//           </SidebarBlock>

//           {/* Branch */}
//           <SidebarBlock className="overflow-visible px-3 py-3">
//             <div className="flex items-center gap-3">
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
//                 <Building2 size={20} />
//               </div>

//               <div className="min-w-0 flex-1 overflow-visible">
//                 <div className="text-[11px] text-white/70">Branch</div>
//                 <div className="relative z-50 mt-0.5 overflow-visible">
//                   <BranchSelect
//                     value={selectedBranch}
//                     onChange={setselectedBranch}
//                     className="sidebar-branch-select w-full min-w-0"
//                     options={branchOptions}
//                   />
//                 </div>
//               </div>

//               <ChevronDown size={18} className="text-white/90" />
//             </div>
//           </SidebarBlock>

//           {/* Scoreboard */}
//           <div className={`${darkCard} px-3 py-3.5`}>
//             <div className="flex items-center justify-between">
//               <div className="inline-flex items-center gap-2 text-[12px] font-medium text-cyan-300">
//                 <LayoutGrid size={16} className="text-cyan-300" />
//                 Scoreboard
//               </div>
//               <button
//                 type="button"
//                 className="text-white/80 transition hover:text-white"
//               >
//                 <span className="text-lg leading-none">⋮</span>
//               </button>
//             </div>

//             <div className="mt-3 grid grid-cols-4 divide-x divide-white/10">
//               <ScoreMetric icon={Users} value={128} label="Leads" colorClass="text-emerald-400" />
//               <ScoreMetric icon={Building2} value={76} label="Customers" colorClass="text-sky-400" />
//               <ScoreMetric icon={BadgeDollarSign} value={42} label="Deals" colorClass="text-amber-400" />
//               <ScoreMetric icon={CheckCircle2} value={18} label="Won Deals" colorClass="text-violet-400" />
//             </div>
//           </div>

//           {/* Period */}
//           <SidebarBlock className="overflow-visible px-3 py-3">
//             <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-white">
//               <CalendarRange size={18} className="text-white/90" />
//               Select Period
//             </div>

//             <div className="grid grid-cols-[minmax(0,1fr)_92px] gap-2 overflow-visible">
//               <div className="relative z-50 overflow-visible">
//                 <CustomSelect
//                   value={localSelectedPeriod}
//                   onChange={handlePeriodChange}
//                   options={periodOptions}
//                   className="sidebar-custom-select w-full min-w-0"
//                   placeholder="Period"
//                 />
//               </div>

//               <div className="relative z-50 overflow-visible">
//                 <CustomSelect
//                   value={selectedYear}
//                   onChange={setSelectedYear}
//                   options={yearOptions}
//                   className="sidebar-custom-select w-full min-w-0"
//                   placeholder="Year"
//                 />
//               </div>
//             </div>
//           </SidebarBlock>

//           {/* Categories */}
//           <SidebarBlock className="min-h-0 flex flex-1 flex-col px-2.5 py-3">
//             <div className="mb-3 flex items-center justify-between px-1">
//               <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-white">
//                 <Layers size={17} className="text-white/90" />
//                 Categories
//               </div>

//               <button
//                 type="button"
//                 onClick={() => handleMoreClick?.()}
//                 className="rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] px-3 py-1.5 text-[11px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:opacity-90"
//               >
//                 View All
//               </button>
//             </div>

//             {targetLoading ? (
//               <SkeletonTable rows={8} columns={2} />
//             ) : (
//               <CategoryListIconFirst
//                 categorylist={normalizedCategories}
//                 handleMoreClick={handleMoreClick}
//                 sidebarOpen={sidebarOpen}
//               />
//             )}
//           </SidebarBlock>

//           {/* Footer notifications */}
//           <div className="rounded-[18px] bg-[linear-gradient(180deg,rgba(0,69,74,0.42),rgba(0,60,64,0.38))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_10px_20px_rgba(0,37,40,0.18)]">
//             <button
//               type="button"
//               className="flex w-full items-center justify-between text-left"
//             >
//               <div className="flex items-center gap-3">
//                 <Bell size={18} className="text-white/90" />
//                 <span className="text-[13px] font-medium text-white">Notifications</span>
//                 <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-cyan-400 px-1.5 text-[11px] font-bold text-white">
//                   3
//                 </span>
//               </div>
//               <ChevronRight size={18} className="text-white/80" />
//             </button>
//           </div>
//         </div>
//       )}
//     </aside>
//   )
// }

// export default Sidebar



// import React, { useEffect, useMemo, useState } from "react"
// import {
//   Menu,
//   ChevronLeft,
//   ChevronRight,
//   Clock3,
//   LayoutGrid,
//   Layers,
//   Building2,
//   CalendarRange,
//   Bell,
//   Users,
//   BadgeDollarSign,
//   CheckCircle2,
//   ChevronDown
// } from "lucide-react"
// import { CustomSelect } from "../common/CustomSelect"

// const MONTH_NAME_TO_NUM = {
//   january: 1,
//   february: 2,
//   march: 3,
//   april: 4,
//   may: 5,
//   june: 6,
//   july: 7,
//   august: 8,
//   september: 9,
//   october: 10,
//   november: 11,
//   december: 12
// }

// const SHORT_MONTH_MAP = {
//   january: "Jan",
//   february: "Feb",
//   march: "Mar",
//   april: "Apr",
//   may: "May",
//   june: "Jun",
//   july: "Jul",
//   august: "Aug",
//   september: "Sep",
//   october: "Oct",
//   november: "Nov",
//   december: "Dec"
// }

// const CATEGORY_THEMES = [
//   {
//     icon: Users,
//     softBg: "bg-emerald-50",
//     iconColor: "text-emerald-500",
//     progress: "from-emerald-400 to-green-500",
//     pill: "bg-emerald-50 text-emerald-600"
//   },
//   {
//     icon: Building2,
//     softBg: "bg-blue-50",
//     iconColor: "text-blue-500",
//     progress: "from-blue-400 to-blue-600",
//     pill: "bg-blue-50 text-blue-600"
//   },
//   {
//     icon: BadgeDollarSign,
//     softBg: "bg-amber-50",
//     iconColor: "text-amber-500",
//     progress: "from-amber-400 to-orange-500",
//     pill: "bg-amber-50 text-amber-600"
//   },
//   {
//     icon: CheckCircle2,
//     softBg: "bg-violet-50",
//     iconColor: "text-violet-500",
//     progress: "from-violet-400 to-purple-500",
//     pill: "bg-violet-50 text-violet-600"
//   }
// ]

// const formatAmount = (num = 0) => `${Number(num || 0)}`

// const getShortMonth = (monthName = "") => {
//   const key = String(monthName).trim().toLowerCase()
//   return SHORT_MONTH_MAP[key] || String(monthName).slice(0, 3)
// }

// const getPeriodRange = (periodLabel) => {
//   if (!periodLabel) return null
//   const cleaned = String(periodLabel).trim()
//   const match = cleaned.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)\s+(\d{4})$/)
//   if (!match) return null

//   const [, startMonthName, endMonthName, year] = match
//   const startNum = MONTH_NAME_TO_NUM[startMonthName.toLowerCase()]
//   const endNum = MONTH_NAME_TO_NUM[endMonthName.toLowerCase()]
//   if (!startNum || !endNum) return null

//   return {
//     startNum,
//     endNum,
//     year: Number(year),
//     displayLabel: `${getShortMonth(startMonthName)} - ${getShortMonth(endMonthName)}`
//   }
// }

// const SidebarBlock = ({ className = "", children }) => (
//   <div
//     className={`relative overflow-visible rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.035))] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_24px_rgba(0,49,53,0.16)] ${className}`}
//   >
//     {children}
//   </div>
// )

// const CategoryCard = ({ item, index, onClick }) => {
//   const theme = CATEGORY_THEMES[index % CATEGORY_THEMES.length]
//   const Icon = theme.icon
//   const achieved = Number(item?.achievedamount || item?.achieved || 0)
//   const target = Number(item?.targetamount || item?.target || 0)
//   const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

//   return (
//     <button
//       type="button"
//       onClick={() => onClick?.(item?.categoryId, item?.categoryName)}
//       className="group flex w-full items-center gap-3 rounded-[18px] bg-white px-3 py-3 text-left shadow-[0_10px_20px_rgba(3,58,64,0.10)] transition hover:-translate-y-[1px]"
//     >
//       <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${theme.softBg}`}>
//         <Icon size={18} className={theme.iconColor} strokeWidth={2.1} />
//       </div>

//       <div className="min-w-0 flex-1">
//         <div className="flex items-center justify-between gap-2">
//           <div className="truncate text-[13px] font-semibold text-slate-800">
//             {item?.categoryName}
//           </div>
//           <div className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${theme.pill}`}>
//             {percentage.toFixed(0)}%
//           </div>
//         </div>

//         <div className="mt-2 flex items-center gap-3">
//           <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200">
//             <div
//               className={`h-full rounded-full bg-gradient-to-r ${theme.progress}`}
//               style={{ width: `${percentage}%` }}
//             />
//           </div>
//           <div className="text-[12px] font-bold text-slate-800">{formatAmount(achieved)}</div>
//           <ChevronRight size={15} className="text-slate-400" />
//         </div>
//       </div>
//     </button>
//   )
// }

// const CategoryListIconFirst = ({ categorylist, handleMoreClick, sidebarOpen }) => {
//   return (
//     <div
//       className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5 ${
//         sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
//       }`}
//     >
//       <div className="space-y-2.5">
//         {categorylist?.length ? (
//           categorylist.map((item, index) => (
//             <CategoryCard
//               key={`${item.categoryId || item.categoryName}-${index}`}
//               item={item}
//               index={index}
//               onClick={(categoryId) => handleMoreClick?.(categoryId)}
//             />
//           ))
//         ) : (
//           <div className="rounded-[18px] bg-white/95 px-3 py-6 text-center text-[12px] text-slate-500">
//             No categories available
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const Sidebar = ({
//   handleMoreClick,
//   targetData,
//   onselectedPeriodChange,
//   achievedPoints,
//   sidebarOpen,
//   toggleSidebar,
//   user,
//   selectedBranch,
//   setselectedBranch,
//   branchOptions,
//   categorylist,
//   targetLoading,
//   BranchSelect,
//   SkeletonTable,
//   selectedYear,
//   setSelectedYear,
//   onavataropenClick,
//   isMobile
// }) => {
//   const [localSelectedPeriod, setLocalSelectedPeriod] = useState(
//     targetData?.selectedPeriodName || ""
//   )

//   useEffect(() => {
//     setLocalSelectedPeriod(targetData?.selectedPeriodName || "")
//   }, [targetData?.selectedPeriodName])

//   const normalizedCategories = useMemo(() => {
//     return (categorylist || []).map((item) => {
//       const target = Number(item.targetamount || 0)
//       const achieved = Number(item.achievedamount || 0)
//       const percent = target > 0 ? Math.min((achieved / target) * 100, 100) : 0
//       return { ...item, target, achieved, percent }
//     })
//   }, [categorylist])

//   const periodOptions = useMemo(() => {
//     return (targetData?.periods || []).map((period) => {
//       const parsed = getPeriodRange(period)
//       return {
//         value: period,
//         label: parsed?.displayLabel || String(period).replace(/\s+\d{4}$/, "")
//       }
//     })
//   }, [targetData?.periods])

//   const yearOptions = useMemo(() => {
//     return Array.from({ length: 6 }, (_, i) => {
//       const year = new Date().getFullYear() - i
//       return { value: String(year), label: String(year) }
//     })
//   }, [])

//   const handlePeriodChange = (value) => {
//     setLocalSelectedPeriod(value)
//     const parsed = getPeriodRange(value)
//     const firstMonthNumber = parsed?.startNum || null
//     if (firstMonthNumber && onselectedPeriodChange) {
//       onselectedPeriodChange(value, firstMonthNumber)
//     }
//   }

//   const companyName = user?.activeCompany?.companyName || "CAMET CRM"
//   const companyShort = companyName?.slice(0, 1)?.toUpperCase() || "C"

//   const SafeBranchSelect = BranchSelect || null
//   const SafeSkeletonTable = SkeletonTable || null

//   return (
//     <aside
//       className={`
//         relative flex h-full flex-col overflow-visible  text-white
//         bg-[radial-gradient(circle_at_top_left,rgba(18,143,142,0.34),transparent_28%),linear-gradient(180deg,#035c63_0%,#04575e_30%,#045058_100%)]
//         shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-1px_0_rgba(0,0,0,0.08),0_22px_45px_rgba(0,68,74,0.22)]
//         transition-[width] duration-300 ease-out lg:flex-shrink-0
//         ${sidebarOpen ? "w-full lg:w-[256px]" : "w-full lg:w-[64px]"}
//       `}
//     >
//       <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%,transparent_72%,rgba(255,255,255,0.03))]" />

//       <div className="relative flex items-center justify-between px-3 pt-3 pb-2">
//         <div
//           className={`flex min-w-0 items-center gap-3 transition-opacity duration-200 ${
//             sidebarOpen ? "opacity-100" : "lg:opacity-0"
//           }`}
//         >
//           <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2f8dff_0%,#1c5fe8_100%)] text-[20px] font-bold text-white shadow-[0_10px_22px_rgba(28,95,232,0.35)]">
//             {companyShort}
//           </div>

//           <div className="min-w-0">
//             <div className="truncate text-[15px] font-bold tracking-tight text-white">
//               {companyName}
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={toggleSidebar}
//           className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_18px_rgba(0,46,50,0.16)] transition hover:scale-[1.02]"
//         >
//           {isMobile ? <Menu size={21} strokeWidth={2.2} /> : sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
//         </button>
//       </div>

//       {sidebarOpen && (
//         <div className="relative min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-3">
//           <SidebarBlock className="px-3 py-3.5">
//             <button
//               type="button"
//               onClick={onavataropenClick}
//               className="flex w-full items-center gap-3 text-left"
//             >
//               <div className="relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
//                 {user?.profileUrl ? (
//                   <img
//                     src={user.profileUrl}
//                     alt="Profile"
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-700">
//                     {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                 )}
//                 <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <div className="truncate text-[14px] font-bold text-white">
//                   {user?.name || "Arjun Mehta"}
//                 </div>
//                 <div className="mt-1 truncate text-[11px] text-white/70">
//                   {user?.role || user?.designation || "Administrator"}
//                 </div>
//               </div>

//               <ChevronRight size={20} className="shrink-0 text-white/85" />
//             </button>
//           </SidebarBlock>

//           <SidebarBlock className="overflow-visible px-3 py-3">
//             <div className="flex items-center gap-3">
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
//                 <Building2 size={20} />
//               </div>

//               <div className="min-w-0 flex-1 overflow-visible">
//                 <div className="text-[11px] text-white/70">Branch</div>
//                 <div className="relative z-50 mt-0.5 overflow-visible">
//                   {SafeBranchSelect ? (
//                     <SafeBranchSelect
//                       value={selectedBranch}
//                       onChange={setselectedBranch}
//                       className="sidebar-branch-select w-full min-w-0"
//                       options={branchOptions}
//                     />
//                   ) : (
//                     <div className="text-[12px] text-white/80">{selectedBranch?.label || "Main Branch"}</div>
//                   )}
//                 </div>
//               </div>

//               <ChevronDown size={18} className="text-white/90" />
//             </div>
//           </SidebarBlock>
//      <div className="px-3">
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

         


//           <SidebarBlock className="overflow-visible px-3 py-3">
//             <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-white">
//               <CalendarRange size={18} className="text-white/90" />
//               Select Period
//             </div>

//             <div className="grid grid-cols-[minmax(0,1fr)_92px] gap-2 overflow-visible">
//               <div className="relative z-50 overflow-visible">
//                 <CustomSelect
//                   value={localSelectedPeriod}
//                   onChange={handlePeriodChange}
//                   options={periodOptions}
//                   className="sidebar-custom-select w-full min-w-0"
//                   placeholder="Period"
//                 />
//               </div>

//               <div className="relative z-50 overflow-visible">
//                 <CustomSelect
//                   value={selectedYear}
//                   onChange={setSelectedYear}
//                   options={yearOptions}
//                   className="sidebar-custom-select w-full min-w-0"
//                   placeholder="Year"
//                 />
//               </div>
//             </div>
//           </SidebarBlock>

//           <SidebarBlock className="min-h-0 flex flex-1 flex-col px-2.5 py-3">
//             <div className="mb-3 flex items-center justify-between px-1">
//               <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-white">
//                 <Layers size={17} className="text-white/90" />
//                 Categories
//               </div>

//               <button
//                 type="button"
//                 onClick={() => handleMoreClick?.()}
//                 className="rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] px-3 py-1.5 text-[11px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:opacity-90"
//               >
//                 View All
//               </button>
//             </div>

//             {targetLoading && SafeSkeletonTable ? (
//               <SafeSkeletonTable rows={8} columns={2} />
//             ) : (
//               <CategoryListIconFirst
//                 categorylist={normalizedCategories}
//                 handleMoreClick={handleMoreClick}
//                 sidebarOpen={sidebarOpen}
//               />
//             )}
//           </SidebarBlock>

     
//         </div>
//       )}
//     </aside>
//   )
// }

// export default Sidebar


import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Layers,
  Building2,
  CalendarRange,
  Users,
  BadgeDollarSign,
  CheckCircle2
} from "lucide-react"
import { CustomSelect } from "../common/CustomSelect"

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
  december: "Dec"
}

const CATEGORY_THEMES = [
  {
    icon: Users,
    softBg: "bg-emerald-50/95",
    iconColor: "text-emerald-600",
    progress: "from-emerald-400 to-green-500",
    pill: "bg-emerald-50 text-emerald-700"
  },
  {
    icon: Building2,
    softBg: "bg-blue-50/95",
    iconColor: "text-blue-600",
    progress: "from-blue-400 to-blue-600",
    pill: "bg-blue-50 text-blue-700"
  },
  {
    icon: BadgeDollarSign,
    softBg: "bg-amber-50/95",
    iconColor: "text-amber-600",
    progress: "from-amber-400 to-orange-500",
    pill: "bg-amber-50 text-amber-700"
  },
  {
    icon: CheckCircle2,
    softBg: "bg-violet-50/95",
    iconColor: "text-violet-600",
    progress: "from-violet-400 to-purple-500",
    pill: "bg-violet-50 text-violet-700"
  }
]

const formatAmount = (num = 0) => `${Number(num || 0)}`

const getShortMonth = (monthName = "") => {
  const key = String(monthName).trim().toLowerCase()
  return SHORT_MONTH_MAP[key] || String(monthName).slice(0, 3)
}

const getPeriodRange = (periodLabel) => {
  if (!periodLabel) return null
  const cleaned = String(periodLabel).trim()
  const match = cleaned.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)\s+(\d{4})$/)
  if (!match) return null

  const [, startMonthName, endMonthName, year] = match
  const startNum = MONTH_NAME_TO_NUM[startMonthName.toLowerCase()]
  const endNum = MONTH_NAME_TO_NUM[endMonthName.toLowerCase()]
  if (!startNum || !endNum) return null

  return {
    startNum,
    endNum,
    year: Number(year),
    displayLabel: `${getShortMonth(startMonthName)} - ${getShortMonth(endMonthName)}`
  }
}

const SidebarBlock = ({ className = "", children }) => (
  <div
    className={`relative overflow-visible rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.035))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_18px_rgba(0,49,53,0.14)] ${className}`}
  >
    {children}
  </div>
)

const CategoryCard = ({ item, index, onClick }) => {
console.log(item)
  const theme = CATEGORY_THEMES[index % CATEGORY_THEMES.length]
  const Icon = theme.icon
  const achieved = Number(item?.achievedamount || item?.achieved || 0)
  const target = Number(item?.targetamount || item?.target || 0)
  const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0

  return (
    <button
      type="button"
      onClick={() => onClick?.(item?.categoryId, item?.categoryName)}
      className="group flex w-full items-center gap-2.5 rounded-[14px] bg-white px-2.5 py-2.5 text-left shadow-[0_6px_14px_rgba(3,58,64,0.08)] transition hover:-translate-y-[1px]"
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.softBg}`}>
        <Icon size={16} className={theme.iconColor} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-[12px] font-semibold text-slate-800">
            {item?.categoryName}
          </div>
          <div className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${theme.pill}`}>
            {percentage.toFixed(0)}%
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${theme.progress}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-[11px] font-bold text-slate-800">
            {formatAmount(achieved)}
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </div>
      </div>
    </button>
  )
}

const CategoryListIconFirst = ({ categorylist, handleMoreClick, sidebarOpen }) => {
  return (
    <div
      className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5 ${
        sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="space-y-2">
        {categorylist?.length ? (
          categorylist.map((item, index) => (
            <CategoryCard
              key={`${item.categoryId || item.categoryName}-${index}`}
              item={item}
              index={index}
              onClick={(categoryId,categoryName) => handleMoreClick?.(categoryId,categoryName)}
            />
          ))
        ) : (
          <div className="rounded-[14px] bg-white/95 px-3 py-5 text-center text-[11px] text-slate-500">
            No categories available
          </div>
        )}
      </div>
    </div>
  )
}

const Sidebar = ({
  handleMoreClick,
  targetData,
  onselectedPeriodChange,
  achievedPoints,
  sidebarOpen,
  toggleSidebar,
  user,
  selectedBranch,
  setselectedBranch,
  branchOptions,
  categorylist,
  targetLoading,
  BranchSelect,
  SkeletonTable,
  selectedYear,
  setSelectedYear,
  onavataropenClick,
  isMobile
}) => {
const navigate=useNavigate()
  const [localSelectedPeriod, setLocalSelectedPeriod] = useState(
    targetData?.selectedPeriodName || ""
  )

  useEffect(() => {
    setLocalSelectedPeriod(targetData?.selectedPeriodName || "")
  }, [targetData?.selectedPeriodName])

  const normalizedCategories = useMemo(() => {
    return (categorylist || []).map((item) => {
      const target = Number(item.targetamount || 0)
      const achieved = Number(item.achievedamount || 0)
      const percent = target > 0 ? Math.min((achieved / target) * 100, 100) : 0
      return { ...item, target, achieved, percent }
    })
  }, [categorylist])

  const periodOptions = useMemo(() => {
    return (targetData?.periods || []).map((period) => {
      const parsed = getPeriodRange(period)
      return {
        value: period,
        label: parsed?.displayLabel || String(period).replace(/\s+\d{4}$/, "")
      }
    })
  }, [targetData?.periods])

  const yearOptions = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const year = new Date().getFullYear() - i
      return { value: String(year), label: String(year) }
    })
  }, [])

  const handlePeriodChange = (value) => {
    setLocalSelectedPeriod(value)
    const parsed = getPeriodRange(value)
    const firstMonthNumber = parsed?.startNum || null
    if (firstMonthNumber && onselectedPeriodChange) {
      onselectedPeriodChange(value, firstMonthNumber)
    }
  }

  const companyName = user?.activeCompany?.companyName || "CAMET CRM"
  const companyShort = companyName?.slice(0, 1)?.toUpperCase() || "C"

  const SafeBranchSelect = BranchSelect || null
  const SafeSkeletonTable = SkeletonTable || null

  return (
    <aside
      className={`
        relative flex h-full flex-col overflow-visible text-white
        bg-[radial-gradient(circle_at_top_left,rgba(18,143,142,0.24),transparent_28%),linear-gradient(180deg,#04545c_0%,#044d55_35%,#04444b_100%)]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-1px_0_rgba(0,0,0,0.08),0_16px_32px_rgba(0,68,74,0.18)]
        transition-[width] duration-300 ease-out lg:flex-shrink-0
        ${sidebarOpen ? "w-full lg:w-[256px]" : "w-full lg:w-[64px]"}
      `}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_42%,transparent_72%,rgba(255,255,255,0.025))]" />

      <div className="relative flex items-center justify-between px-2.5 pt-2.5 pb-2">
        <div
          className={`flex min-w-0 items-center gap-2.5 transition-opacity duration-200 ${
            sidebarOpen ? "opacity-100" : "lg:opacity-0"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2f8dff_0%,#1c5fe8_100%)] text-[16px] font-bold text-white shadow-[0_8px_18px_rgba(28,95,232,0.28)]">
            {companyShort}
          </div>

          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold tracking-tight text-white">
              {companyName}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_6px_14px_rgba(0,46,50,0.14)] transition hover:scale-[1.02]"
        >
          {isMobile ? (
            <Menu size={18} strokeWidth={2.2} />
          ) : sidebarOpen ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      </div>

      {sidebarOpen && (
        <div className="relative min-h-0 flex-1 space-y-2.5 overflow-y-auto px-2.5 pb-2.5">
          <SidebarBlock className="px-2.5 py-2.5">
            <button
              type="button"
              onClick={onavataropenClick}
              className="flex w-full items-center gap-2.5 text-left"
            >
              <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full bg-white shadow-[0_6px_14px_rgba(0,0,0,0.1)]">
                {user?.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[16px] font-bold text-slate-700">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-bold text-white">
                  {user?.name?.toUpperCase()|| "User"}
                </div>
                <div className="mt-0.5 truncate text-[10px] text-white/68">
                  {user?.role || user?.designation || "Administrator"}
                </div>
              </div>

              <ChevronRight size={16} className="shrink-0 text-white/75" />
            </button>
          </SidebarBlock>

          <SidebarBlock className="overflow-visible px-2.5 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <Building2 size={16} />
              </div>

              <div className="min-w-0 flex-1 overflow-visible">
                <div className="text-[10px] text-white/68">Branch</div>
                <div className="relative z-50 mt-0.5 overflow-visible">
                  {SafeBranchSelect ? (
                    <SafeBranchSelect
                      value={selectedBranch}
                      onChange={setselectedBranch}
                      className="sidebar-branch-select w-full min-w-0"
                      options={branchOptions}
                    />
                  ) : (
                    <div className="text-[11px] text-white/85">
                      {selectedBranch?.label || "Main Branch"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SidebarBlock>

          <div 
onClick={()=> navigate("/admin//reports/incentiveReport")}
className="rounded-[14px] bg-black px-2.5 py-2.5 shadow-sm hover:cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-300">
                Score Board
              </span>
              <span className="text-[9px] font-medium text-slate-400">
                {categorylist?.length || 0}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] font-medium leading-4 text-slate-200">
                Achieved Points
              </span>
              <span className="text-[14px] font-semibold leading-none text-white">
                {achievedPoints}
              </span>
            </div>
          </div>

          <SidebarBlock className="overflow-visible px-2.5 py-2.5">
            <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-white">
              <CalendarRange size={15} className="text-white/90" />
              Select Period
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_80px] gap-1.5 overflow-visible">
              <div className="relative z-50 overflow-visible">
                <CustomSelect
                  value={localSelectedPeriod}
                  onChange={handlePeriodChange}
                  options={periodOptions}
                  className="sidebar-custom-select w-full min-w-0"
                  placeholder="Period"
                />
              </div>

              <div className="relative z-50 overflow-visible">
                <CustomSelect
                  value={selectedYear}
                  onChange={setSelectedYear}
                  options={yearOptions}
                  className="sidebar-custom-select w-full min-w-0"
                  placeholder="Year"
                />
              </div>
            </div>
          </SidebarBlock>

          <SidebarBlock className="min-h-0 flex flex-1 flex-col px-2 py-2.5">
            <div className="mb-2.5 flex items-center justify-between px-1">
              <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white">
                <Layers size={15} className="text-white/90" />
                Categories
              </div>

              {/* <button
                type="button"
                onClick={() => handleMoreClick?.()}
                className="rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] px-2.5 py-1 text-[10px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:opacity-90"
              >
                View All
              </button> */}
            </div>

            {targetLoading && SafeSkeletonTable ? (
              <SafeSkeletonTable rows={8} columns={2} />
            ) : (
              <CategoryListIconFirst
                categorylist={normalizedCategories}
                handleMoreClick={handleMoreClick}
                sidebarOpen={sidebarOpen}
              />
            )}
          </SidebarBlock>
        </div>
      )}
    </aside>
  )
}

export default Sidebar