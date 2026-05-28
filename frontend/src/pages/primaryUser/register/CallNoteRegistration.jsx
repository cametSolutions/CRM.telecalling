// import React, { useState, useEffect } from "react"
// import DeleteAlert from "../../../components/common/DeleteAlert"
// import Edit from "../../../components/common/Edit"
// import api from "../../../api/api"
// import UseFetch from "../../../hooks/useFetch"
// import { toast } from "react-toastify"
// export const CallNoteRegistration = () => {
//   const [value, setValue] = useState("")
//   const [items, setItems] = useState([])

//   const [editState, seteditState] = useState(true)
//   const [editId, setEditId] = useState("")
//   const { data, loading, error, refreshHook } = UseFetch(
//     "/customer/getallcallNotes"
//   )
//   useEffect(() => {
//     if (data) {
//       setItems(data)
//       // setTotalPages(data.data.totalPages)
//     }
//   }, [data])

//   const handleEdit = (id) => {
//     seteditState(false)
//     const itemToEdit = items.find((item) => item._id === id)
//     if (itemToEdit) {
//       setValue(itemToEdit.callNotes)
//       setEditId(id)

//       // Store the ID of the brand being edited
//     }
//   }
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/customer/callnoteDelete?id=${id}`)

//       // Remove the deleted item from the items array
//       setItems((prevItems) => prevItems.filter((item) => item._id !== id))
//       setValue("")
//     } catch (error) {
//       console.error("Failed to delete item", error)
//       // toast.error("Failed to delete item. Please try again.")
//     }
//   }

//   const handleChange = (e) => {
//     setValue(e.target.value)
//   }

//   const handleSubmit = async () => {
//     const formData = {
//       callNotes: value
//     }

//     try {
//       if (editId) {
//         // Update the existing item

//         await api.put(`/customer/callnotesEdit?id=${editId}`, formData)

//         toast.success("Call notes updated successfully")
//         seteditState(true)
//       } else {
//         // Create a new item

//         await api.post("/customer/callnotesRegistration", formData)

//         toast.success("callnote created successfully")
//       }
//       // Refresh the list
//       // const response = await api.get(
//       //   `/inventory/getproductsubDetails?tab=${tab}`
//       // )
//       refreshHook()
//       //setItems(data.data)
//       // Reset form
//       // setValue("")
//       setEditId(null)
//     } catch (error) {
//       console.error(error)
//       toast.error("Something went wrong")
//     }
//   }

//   return (
//     <div className="h-full bg-[#ADD8E6] p-5">
//       <div className="bg-white rounded-md">
//         <h1 className="text-sm font-bold mb-6  text-gray-800 px-6 pt-6  uppercase">
//           ADD YOUR DESIRED CALL NOTE
//         </h1>

//         <div className="flex items-center  w-full px-6  ">
//           <input
//             type="text"
//             //   onKeyDown={(e) => {
//             //     if (e.key === "Enter") {
//             //       handleSubmit(value)
//             //     }
//             //   }}
//             onChange={(e) => {
//               handleChange(e)
//             }}
//             placeholder="Enter your brand name"
//             className="w-full md:w-1/2  p-1  border border-gray-300 rounded focus:border-gray-500 outline-none"
//             value={value}
//             //   onChange={(e) => setValue(e.target.value)}
//           />
//           <div className="flex justify-between m-4">
//             <button
//               // onClick={
//               //   edit?.enabled
//               //     ? () => editSubDetails(edit.id, value)
//               //     : () => handleSubmit(value)
//               // }
//               onClick={handleSubmit}
//               className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded "
//             >
//               {editState ? "SUBMIT" : "UPDATE"}
//             </button>
//           </div>
//         </div>
//         <section className="m-8">
//           <div className="w-full xl:mb-0">
//             <div className="relative flex flex-col min-w-0 break-words bg-red-50 w-full mb-6 p-6 shadow-xl rounded">
//               <div className="block w-full overflow-x-auto overflow-y-auto h-[calc(80vh-200px)]">
//                 <table className="items-center w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-300 sticky top-0 z-10">
//                       <th className="w-3/6 px-6 text-left text-black  py-3 text-sm uppercase whitespace-nowrap font-semibold">
//                         Call Note
//                       </th>
//                       <th className="px-6 w-1/6 text-center text-blue-500 align-middle  py-3 text-sm uppercase  whitespace-nowrap font-semibold">
//                         Edit
//                       </th>
//                       <th className="px-6 w-1/6 text-right text-red-500 align-middle  py-3 text-sm uppercase whitespace-nowrap font-semibold">
//                         Delete
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {items?.map((el) => (
//                       <tr key={el._id}>
//                         <th className="px-6 text-left col-span-2 text-wrap border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap text-black p-2">
//                           {el.callNotes}
//                         </th>
//                         <td className="cursor-pointer text-center flex justify-center px-6 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
//                           <Edit onEdit={handleEdit} Id={el._id} />
//                         </td>
//                         <td className="cursor-pointer text-right px-6 border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
//                           <DeleteAlert onDelete={handleDelete} Id={el._id} />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* <section className=" m-8 ">
//         <div className="w-full xl:mb-0 ">
//           <div className="relative flex flex-col min-w-0 break-words bg-red-50 w-full mb-6 p-6 shadow-xl  rounded">
//             <div className="block w-full  overflow-x-auto ">
//               <table className="items-center  w-full border-collapse">
//                 <thead>
//                   <tr>
//                     <th className=" w-3/6  px-6 text-left  text-black border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
//                       Call Note
//                     </th>
//                     <th className="px-6 w-1/6 text-center  text-blue-500 align-middle border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
//                       Edit
//                     </th>
//                     <th className="px-6 w-1/6 text-right  text-red-500 align-middle border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
//                       Delete
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {items?.map((el) => (
//                     <tr key={el._id}>
//                       <th className="px-6 text-left col-span-2 text-wrap border-t-0 align-middle border-l-0 border-r-0  whitespace-nowrap  text-black p-2">
//                         {el.callNotes}
//                       </th>
//                       <td className="cursor-pointer text-center flex justify-center px-6 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 ">
//                         <Edit onEdit={handleEdit} Id={el._id} />
//                       </td>
//                       <td className=" cursor-pointer text-right  px-6 border-t-0 align-middle border-l-0 border-r-0  whitespace-nowrap p-2">
//                         <DeleteAlert onDelete={handleDelete} Id={el._id} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </section> */}
//       </div>
//     </div>
//   )
// }


// import React, { useState, useEffect, useRef } from "react"
// import api from "../../../api/api"
// import UseFetch from "../../../hooks/useFetch"
// import { toast } from "react-toastify"

// /* ─────────────────────────────────────────────
//    Inline styles — mirrors ProductSubDetailsForm
// ───────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

//   .cn-root * { box-sizing: border-box; margin: 0; padding: 0; }

//   .cn-root {
//     font-family: 'DM Sans', sans-serif;
//     background: #f8f9fc;
//     min-height: 80vh;
//     color: #1a1d2e;
//   }

//   /* ── Header ── */
//   .cn-header {
//     background: #1a1d2e;
//     padding: 18px 28px;
//     display: flex;
//     align-items: center;
//     gap: 14px;
//     position: sticky;
//     top: 0;
//     z-index: 40;
//     box-shadow: 0 1px 0 rgba(255,255,255,.08);
//   }
//   .cn-header-icon {
//     display: none;
//     font-size: 26px;
//     color: #a8b3cf;
//     cursor: pointer;
//     background: none;
//     border: none;
//     line-height: 1;
//   }
//   @media (max-width: 768px) { .cn-header-icon { display: block; } }
//   .cn-header-title {
//     font-size: 15px;
//     font-weight: 600;
//     color: #ffffff;
//     letter-spacing: .5px;
//   }
//   .cn-header-badge {
//     margin-left: auto;
//     background: rgba(99,102,241,.25);
//     color: #a5b4fc;
//     font-size: 11px;
//     font-weight: 600;
//     padding: 3px 10px;
//     border-radius: 20px;
//     letter-spacing: .4px;
//     text-transform: uppercase;
//   }

//   /* ── Body ── */
//   .cn-body {
//     max-width: 860px;
//     margin: 0 auto;
//     padding: 32px 24px 60px;
//   }

//   /* ── Card ── */
//   .cn-card {
//     background: #fff;
//     border-radius: 14px;
//     border: 1px solid #e8eaf0;
//     box-shadow: 0 2px 12px rgba(0,0,0,.05);
//     overflow: hidden;
//   }

//   /* ── Input section ── */
//   .cn-input-section {
//     padding: 28px 28px 24px;
//     border-bottom: 1px solid #f0f1f5;
//   }
//   .cn-section-label {
//     font-size: 11.5px;
//     font-weight: 600;
//     letter-spacing: 1px;
//     text-transform: uppercase;
//     color: #7c8db0;
//     margin-bottom: 14px;
//   }
//   .cn-input-row {
//     display: flex;
//     gap: 10px;
//     align-items: center;
//     flex-wrap: wrap;
//   }
//   .cn-input {
//     flex: 1;
//     min-width: 200px;
//     height: 42px;
//     padding: 0 14px;
//     border: 1.5px solid #e2e5ee;
//     border-radius: 8px;
//     font-size: 14px;
//     font-family: 'DM Sans', sans-serif;
//     color: #1a1d2e;
//     background: #f8f9fc;
//     outline: none;
//     transition: border-color .2s, box-shadow .2s, background .2s;
//   }
//   .cn-input:focus {
//     border-color: #6366f1;
//     background: #fff;
//     box-shadow: 0 0 0 3px rgba(99,102,241,.12);
//   }
//   .cn-input::placeholder { color: #b0b8cc; }

//   .cn-btn {
//     height: 42px;
//     padding: 0 22px;
//     border: none;
//     border-radius: 8px;
//     font-size: 13px;
//     font-weight: 600;
//     cursor: pointer;
//     letter-spacing: .3px;
//     transition: background .18s, transform .12s, box-shadow .18s;
//     white-space: nowrap;
//   }
//   .cn-btn:active { transform: scale(.97); }

//   .cn-btn-submit {
//     background: #6366f1;
//     color: #fff;
//     box-shadow: 0 2px 8px rgba(99,102,241,.25);
//   }
//   .cn-btn-submit:hover { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,.35); }

//   .cn-btn-cancel {
//     background: #f1f2f6;
//     color: #5a6279;
//   }
//   .cn-btn-cancel:hover { background: #e8eaf0; }

//   .cn-edit-hint {
//     margin-top: 10px;
//     font-size: 12.5px;
//     color: #7c8db0;
//     display: flex;
//     align-items: center;
//     gap: 6px;
//   }
//   .cn-edit-dot {
//     width: 7px; height: 7px;
//     border-radius: 50%;
//     background: #f59e0b;
//     display: inline-block;
//     animation: cnpulse 1.6s infinite;
//   }
//   @keyframes cnpulse {
//     0%,100% { opacity: 1; }
//     50%      { opacity: .35; }
//   }

//   /* ── Table section ── */
//   .cn-table-section { overflow: hidden; }

//   .cn-table-header {
//     padding: 14px 28px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     background: #f8f9fc;
//     border-bottom: 1px solid #f0f1f5;
//   }
//   .cn-table-title {
//     font-size: 13px;
//     font-weight: 600;
//     color: #3d4566;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }
//   .cn-count-badge {
//     background: #e8eaf0;
//     color: #5a6279;
//     border-radius: 20px;
//     padding: 2px 9px;
//     font-size: 11.5px;
//     font-weight: 600;
//     font-family: 'DM Mono', monospace;
//   }

//   .cn-table-wrap { overflow-x: auto; }

//   .cn-table {
//     width: 100%;
//     border-collapse: collapse;
//     font-size: 13.5px;
//   }
//   .cn-table thead tr {
//     background: #f8f9fc;
//     border-bottom: 1px solid #e8eaf0;
//   }
//   .cn-table th {
//     padding: 11px 20px;
//     text-align: left;
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: .8px;
//     text-transform: uppercase;
//     color: #9099b3;
//   }
//   .cn-table th.center { text-align: center; }
//   .cn-table th.right  { text-align: right; }

//   .cn-table tbody tr {
//     border-bottom: 1px solid #f3f4f8;
//     transition: background .15s;
//   }
//   .cn-table tbody tr:last-child { border-bottom: none; }
//   .cn-table tbody tr:hover { background: #fafbff; }

//   .cn-table td, .cn-table td.name-cell {
//     padding: 13px 20px;
//     color: #2d3352;
//     vertical-align: middle;
//   }
//   .cn-table td.center { text-align: center; }
//   .cn-table td.right  { text-align: right; }

//   .cn-item-name {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//   }
//   .cn-item-dot {
//     width: 8px; height: 8px;
//     border-radius: 50%;
//     background: #6366f1;
//     flex-shrink: 0;
//     opacity: .55;
//   }
//   .cn-item-text { font-weight: 500; color: #1a1d2e; }

//   /* ── Actions ── */
//   .cn-actions { display: flex; align-items: center; gap: 6px; }
//   .cn-action-btn {
//     width: 32px; height: 32px;
//     border-radius: 7px;
//     border: none;
//     cursor: pointer;
//     display: flex; align-items: center; justify-content: center;
//     transition: background .15s, transform .12s;
//     font-size: 14px;
//   }
//   .cn-action-btn:active { transform: scale(.9); }
//   .cn-action-edit   { background: #eef2ff; color: #6366f1; }
//   .cn-action-edit:hover   { background: #e0e7ff; }
//   .cn-action-delete { background: #fff1f2; color: #f43f5e; }
//   .cn-action-delete:hover { background: #ffe4e6; }

//   /* ── Empty state ── */
//   .cn-empty {
//     padding: 56px 20px;
//     text-align: center;
//     color: #9099b3;
//   }
//   .cn-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: .55; }
//   .cn-empty-text { font-size: 14px; font-weight: 500; }
//   .cn-empty-sub  { font-size: 12.5px; margin-top: 4px; color: #b0b8cc; }

//   /* ── Skeleton ── */
//   .cn-skeleton-row td { padding: 13px 20px; }
//   .cn-skeleton {
//     height: 14px;
//     border-radius: 6px;
//     background: linear-gradient(90deg, #f0f1f5 25%, #e8eaf0 50%, #f0f1f5 75%);
//     background-size: 200% 100%;
//     animation: cnshimmer 1.4s infinite;
//   }
//   @keyframes cnshimmer {
//     0%   { background-position: 200% 0; }
//     100% { background-position: -200% 0; }
//   }

//   @media (max-width: 480px) {
//     .cn-input-row { flex-direction: column; align-items: stretch; }
//     .cn-btn { width: 100%; }
//     .cn-body { padding: 20px 14px 50px; }
//     .cn-input-section { padding: 20px 18px; }
//     .cn-table th, .cn-table td { padding: 11px 14px; }
//   }
// `

// /* ── Icons ── */
// const PencilIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
//   </svg>
// )
// const TrashIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="3 6 5 6 21 6"/>
//     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
//     <path d="M10 11v6M14 11v6"/>
//     <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
//   </svg>
// )
// const MenuIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <line x1="3" y1="6" x2="21" y2="6"/>
//     <line x1="3" y1="12" x2="21" y2="12"/>
//     <line x1="3" y1="18" x2="21" y2="18"/>
//   </svg>
// )

// /* ── Confirm Delete Modal ── */
// function ConfirmDelete({ onConfirm, onCancel }) {
//   return (
//     <div style={{
//       position: "fixed", inset: 0, zIndex: 200,
//       background: "rgba(15,17,30,.45)", backdropFilter: "blur(3px)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       padding: "20px"
//     }}>
//       <div style={{
//         background: "#fff", borderRadius: "14px", padding: "30px 28px",
//         maxWidth: "380px", width: "100%",
//         boxShadow: "0 20px 50px rgba(0,0,0,.18)"
//       }}>
//         <div style={{ fontSize: "28px", marginBottom: "12px" }}>🗑️</div>
//         <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "15px", color: "#1a1d2e", marginBottom: "6px" }}>
//           Delete this call note?
//         </p>
//         <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#7c8db0", marginBottom: "22px" }}>
//           This action cannot be undone.
//         </p>
//         <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
//           <button className="cn-btn cn-btn-cancel" onClick={onCancel}>Cancel</button>
//           <button className="cn-btn" onClick={onConfirm}
//             style={{ background: "#f43f5e", color: "#fff", boxShadow: "0 2px 8px rgba(244,63,94,.25)" }}>
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ── Main Component ── */
// export const CallNoteRegistration = ({ onToggleSidebar }) => {
//   const [value, setValue]               = useState("")
//   const [items, setItems]               = useState([])
//   const [isEditing, setIsEditing]       = useState(false)
//   const [editId, setEditId]             = useState(null)
//   const [deleteTarget, setDeleteTarget] = useState(null)
//   const inputRef                        = useRef(null)

//   const { data, loading, refreshHook } = UseFetch("/customer/getallcallNotes")

//   useEffect(() => { if (data) setItems(data) }, [data])

//   const resetForm = () => {
//     setValue("")
//     setIsEditing(false)
//     setEditId(null)
//   }

//   const handleEdit = (id) => {
//     const item = items.find((i) => i._id === id)
//     if (!item) return
//     setValue(item.callNotes)
//     setEditId(id)
//     setIsEditing(true)
//     inputRef.current?.focus()
//   }

//   const handleDeleteConfirm = async () => {
//     const id = deleteTarget
//     setDeleteTarget(null)
//     try {
//       await api.delete(`/customer/callnoteDelete?id=${id}`)
//       setItems((prev) => prev.filter((i) => i._id !== id))
//       if (editId === id) resetForm()
//     } catch {
//       toast.error("Failed to delete. Try again.")
//     }
//   }

//   const handleSubmit = async () => {
//     const trimmed = value.trim()
//     if (!trimmed) {
//       toast.error("Call note cannot be empty.")
//       inputRef.current?.focus()
//       return
//     }
//     const formData = { callNotes: trimmed }
//     try {
//       if (isEditing && editId) {
//         await api.put(`/customer/callnotesEdit?id=${editId}`, formData)
//         toast.success("Call note updated successfully")
//       } else {
//         await api.post("/customer/callnotesRegistration", formData)
//         toast.success("Call note created successfully")
//       }
//       resetForm()
//       refreshHook()
//     } catch {
//       toast.error("Something went wrong. Please try again.")
//     }
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSubmit()
//     if (e.key === "Escape") resetForm()
//   }

//   return (
//     <>
//       <style>{styles}</style>

//       {deleteTarget && (
//         <ConfirmDelete
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setDeleteTarget(null)}
//         />
//       )}

//       <div className="cn-root">
//         {/* ── Header ── */}
//         <header className="cn-header">
//           <button className="cn-header-icon" onClick={onToggleSidebar} aria-label="Toggle sidebar">
//             <MenuIcon />
//           </button>
//           <span className="cn-header-title">Manage Call Notes</span>
//           <span className="cn-header-badge">Customer</span>
//         </header>

//         {/* ── Body ── */}
//         <div className="cn-body">
//           <div className="cn-card">

//             {/* Input section */}
//             <div className="cn-input-section">
//               <p className="cn-section-label">
//                 {isEditing ? "Edit Call Note" : "Add New Call Note"}
//               </p>
//               <div className="cn-input-row">
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   className="cn-input"
//                   placeholder="Enter call note…"
//                   value={value}
//                   onChange={(e) => setValue(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   aria-label="Call note"
//                 />
//                 <button className="cn-btn cn-btn-submit" onClick={handleSubmit}>
//                   {isEditing ? "Update" : "Add Call Note"}
//                 </button>
//                 {isEditing && (
//                   <button className="cn-btn cn-btn-cancel" onClick={resetForm}>
//                     Cancel
//                   </button>
//                 )}
//               </div>
//               {isEditing && (
//                 <p className="cn-edit-hint">
//                   <span className="cn-edit-dot" />
//                   Editing mode — press Escape or Cancel to discard
//                 </p>
//               )}
//             </div>

//             {/* Table section */}
//             <div className="cn-table-section">
//               <div className="cn-table-header">
//                 <span className="cn-table-title">
//                   All Call Notes
//                   <span className="cn-count-badge">{loading ? "—" : items.length}</span>
//                 </span>
//               </div>

//               <div className="cn-table-wrap">
//                 <table className="cn-table" role="table">
//                   <thead>
//                     <tr>
//                       <th style={{ width: "60%" }}>Call Note</th>
//                       <th className="center" style={{ width: "20%" }}>Edit</th>
//                       <th className="right"  style={{ width: "20%" }}>Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       Array.from({ length: 4 }).map((_, i) => (
//                         <tr key={i} className="cn-skeleton-row">
//                           <td><div className="cn-skeleton" style={{ width: `${50 + i * 10}%` }} /></td>
//                           <td className="center"><div className="cn-skeleton" style={{ width: 32, height: 32, borderRadius: 7, margin: "auto" }} /></td>
//                           <td className="right"><div className="cn-skeleton" style={{ width: 32, height: 32, borderRadius: 7, marginLeft: "auto" }} /></td>
//                         </tr>
//                       ))
//                     ) : items.length === 0 ? (
//                       <tr>
//                         <td colSpan={3}>
//                           <div className="cn-empty">
//                             <div className="cn-empty-icon">📂</div>
//                             <p className="cn-empty-text">No call notes yet</p>
//                             <p className="cn-empty-sub">Add your first one using the field above</p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       items.map((el) => (
//                         <tr key={el._id}>
//                           <td>
//                             <div className="cn-item-name">
//                               <span className="cn-item-dot" />
//                               <span className="cn-item-text">{el.callNotes}</span>
//                             </div>
//                           </td>
//                           <td className="center">
//                             <div className="cn-actions" style={{ justifyContent: "center" }}>
//                               <button
//                                 className="cn-action-btn cn-action-edit"
//                                 onClick={() => handleEdit(el._id)}
//                                 title={`Edit ${el.callNotes}`}
//                                 aria-label={`Edit ${el.callNotes}`}
//                               >
//                                 <PencilIcon />
//                               </button>
//                             </div>
//                           </td>
//                           <td className="right">
//                             <div className="cn-actions" style={{ justifyContent: "flex-end" }}>
//                               <button
//                                 className="cn-action-btn cn-action-delete"
//                                 onClick={() => setDeleteTarget(el._id)}
//                                 title={`Delete ${el.callNotes}`}
//                                 aria-label={`Delete ${el.callNotes}`}
//                               >
//                                 <TrashIcon />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   )
// // }
// import React, { useState, useEffect, useRef } from "react"
// import api from "../../../api/api"
// import UseFetch from "../../../hooks/useFetch"
// import { toast } from "react-toastify"

// /* ─────────────────────────────────────────────
//    Inline styles — mirrors ProductSubDetailsForm
// ───────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

//   .cn-root * { box-sizing: border-box; margin: 0; padding: 0; }

//   .cn-root {
//     font-family: 'DM Sans', sans-serif;
//     background: #f8f9fc;
//     height: 100%;
//     width: 100%;
//     display: flex;
//     flex-direction: column;
//     overflow: hidden;
//     color: #1a1d2e;
//   }

//   /* ── Header ── */
//   .cn-header {
//     background: #1a1d2e;
//     padding: 18px 28px;
//     display: flex;
//     align-items: center;
//     gap: 14px;
//     flex-shrink: 0;
//     z-index: 40;
//     box-shadow: 0 1px 0 rgba(255,255,255,.08);
//   }
//   .cn-header-icon {
//     display: none;
//     font-size: 26px;
//     color: #a8b3cf;
//     cursor: pointer;
//     background: none;
//     border: none;
//     line-height: 1;
//   }
//   @media (max-width: 768px) { .cn-header-icon { display: block; } }
//   .cn-header-title {
//     font-size: 15px;
//     font-weight: 600;
//     color: #ffffff;
//     letter-spacing: .5px;
//   }
//   .cn-header-badge {
//     margin-left: auto;
//     background: rgba(99,102,241,.25);
//     color: #a5b4fc;
//     font-size: 11px;
//     font-weight: 600;
//     padding: 3px 10px;
//     border-radius: 20px;
//     letter-spacing: .4px;
//     text-transform: uppercase;
//   }

//   /* ── Body ── */
//   .cn-body {
//     flex: 1;
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//     max-width: 860px;
//     width: 100%;
//     margin: 0 auto;
//     padding: 32px 24px;
//   }

//   /* ── Card ── */
//   .cn-card {
//     background: #fff;
//     border-radius: 14px;
//     border: 1px solid #e8eaf0;
//     box-shadow: 0 2px 12px rgba(0,0,0,.05);
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//     min-height: 0;
//   }

//   /* ── Input section ── */
//   .cn-input-section {
//     padding: 28px 28px 24px;
//     border-bottom: 1px solid #f0f1f5;
//   }
//   .cn-section-label {
//     font-size: 11.5px;
//     font-weight: 600;
//     letter-spacing: 1px;
//     text-transform: uppercase;
//     color: #7c8db0;
//     margin-bottom: 14px;
//   }
//   .cn-input-row {
//     display: flex;
//     gap: 10px;
//     align-items: center;
//     flex-wrap: wrap;
//   }
//   .cn-input {
//     flex: 1;
//     min-width: 200px;
//     height: 42px;
//     padding: 0 14px;
//     border: 1.5px solid #e2e5ee;
//     border-radius: 8px;
//     font-size: 14px;
//     font-family: 'DM Sans', sans-serif;
//     color: #1a1d2e;
//     background: #f8f9fc;
//     outline: none;
//     transition: border-color .2s, box-shadow .2s, background .2s;
//   }
//   .cn-input:focus {
//     border-color: #6366f1;
//     background: #fff;
//     box-shadow: 0 0 0 3px rgba(99,102,241,.12);
//   }
//   .cn-input::placeholder { color: #b0b8cc; }

//   .cn-btn {
//     height: 42px;
//     padding: 0 22px;
//     border: none;
//     border-radius: 8px;
//     font-size: 13px;
//     font-weight: 600;
//     cursor: pointer;
//     letter-spacing: .3px;
//     transition: background .18s, transform .12s, box-shadow .18s;
//     white-space: nowrap;
//   }
//   .cn-btn:active { transform: scale(.97); }

//   .cn-btn-submit {
//     background: #6366f1;
//     color: #fff;
//     box-shadow: 0 2px 8px rgba(99,102,241,.25);
//   }
//   .cn-btn-submit:hover { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,.35); }

//   .cn-btn-cancel {
//     background: #f1f2f6;
//     color: #5a6279;
//   }
//   .cn-btn-cancel:hover { background: #e8eaf0; }

//   .cn-edit-hint {
//     margin-top: 10px;
//     font-size: 12.5px;
//     color: #7c8db0;
//     display: flex;
//     align-items: center;
//     gap: 6px;
//   }
//   .cn-edit-dot {
//     width: 7px; height: 7px;
//     border-radius: 50%;
//     background: #f59e0b;
//     display: inline-block;
//     animation: cnpulse 1.6s infinite;
//   }
//   @keyframes cnpulse {
//     0%,100% { opacity: 1; }
//     50%      { opacity: .35; }
//   }

//   /* ── Table section ── */
//   .cn-table-section {
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//     min-height: 0;
//     overflow: hidden;
//   }

//   .cn-table-header {
//     padding: 14px 28px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     background: #f8f9fc;
//     border-bottom: 1px solid #f0f1f5;
//   }
//   .cn-table-title {
//     font-size: 13px;
//     font-weight: 600;
//     color: #3d4566;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }
//   .cn-count-badge {
//     background: #e8eaf0;
//     color: #5a6279;
//     border-radius: 20px;
//     padding: 2px 9px;
//     font-size: 11.5px;
//     font-weight: 600;
//     font-family: 'DM Mono', monospace;
//   }

//   .cn-table-wrap {
//     overflow-x: auto;
//     overflow-y: auto;
//     flex: 1;
//     min-height: 0;
//   }

//   .cn-table {
//     width: 100%;
//     border-collapse: collapse;
//     font-size: 13.5px;
//   }
//   .cn-table thead tr {
//     background: #f8f9fc;
//     border-bottom: 1px solid #e8eaf0;
//   }
//   .cn-table thead th {
//     position: sticky;
//     top: 0;
//     z-index: 2;
//     background: #f8f9fc;
//   }
//   .cn-table th {
//     padding: 11px 20px;
//     text-align: left;
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: .8px;
//     text-transform: uppercase;
//     color: #9099b3;
//   }
//   .cn-table th.center { text-align: center; }
//   .cn-table th.right  { text-align: right; }

//   .cn-table tbody tr {
//     border-bottom: 1px solid #f3f4f8;
//     transition: background .15s;
//   }
//   .cn-table tbody tr:last-child { border-bottom: none; }
//   .cn-table tbody tr:hover { background: #fafbff; }

//   .cn-table td, .cn-table td.name-cell {
//     padding: 13px 20px;
//     color: #2d3352;
//     vertical-align: middle;
//   }
//   .cn-table td.center { text-align: center; }
//   .cn-table td.right  { text-align: right; }

//   .cn-item-name {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//   }
//   .cn-item-dot {
//     width: 8px; height: 8px;
//     border-radius: 50%;
//     background: #6366f1;
//     flex-shrink: 0;
//     opacity: .55;
//   }
//   .cn-item-text { font-weight: 500; color: #1a1d2e; }

//   /* ── Actions ── */
//   .cn-actions { display: flex; align-items: center; gap: 6px; }
//   .cn-action-btn {
//     width: 32px; height: 32px;
//     border-radius: 7px;
//     border: none;
//     cursor: pointer;
//     display: flex; align-items: center; justify-content: center;
//     transition: background .15s, transform .12s;
//     font-size: 14px;
//   }
//   .cn-action-btn:active { transform: scale(.9); }
//   .cn-action-edit   { background: #eef2ff; color: #6366f1; }
//   .cn-action-edit:hover   { background: #e0e7ff; }
//   .cn-action-delete { background: #fff1f2; color: #f43f5e; }
//   .cn-action-delete:hover { background: #ffe4e6; }

//   /* ── Empty state ── */
//   .cn-empty {
//     padding: 56px 20px;
//     text-align: center;
//     color: #9099b3;
//   }
//   .cn-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: .55; }
//   .cn-empty-text { font-size: 14px; font-weight: 500; }
//   .cn-empty-sub  { font-size: 12.5px; margin-top: 4px; color: #b0b8cc; }

//   /* ── Skeleton ── */
//   .cn-skeleton-row td { padding: 13px 20px; }
//   .cn-skeleton {
//     height: 14px;
//     border-radius: 6px;
//     background: linear-gradient(90deg, #f0f1f5 25%, #e8eaf0 50%, #f0f1f5 75%);
//     background-size: 200% 100%;
//     animation: cnshimmer 1.4s infinite;
//   }
//   @keyframes cnshimmer {
//     0%   { background-position: 200% 0; }
//     100% { background-position: -200% 0; }
//   }

//   @media (max-width: 480px) {
//     .cn-input-row { flex-direction: column; align-items: stretch; }
//     .cn-btn { width: 100%; }
//     .cn-body { padding: 16px 14px; }
//     .cn-input-section { padding: 20px 18px; }
//     .cn-table th, .cn-table td { padding: 11px 14px; }
//   }
// `

// /* ── Icons ── */
// const PencilIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
//   </svg>
// )
// const TrashIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="3 6 5 6 21 6"/>
//     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
//     <path d="M10 11v6M14 11v6"/>
//     <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
//   </svg>
// )
// const MenuIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <line x1="3" y1="6" x2="21" y2="6"/>
//     <line x1="3" y1="12" x2="21" y2="12"/>
//     <line x1="3" y1="18" x2="21" y2="18"/>
//   </svg>
// )

// /* ── Confirm Delete Modal ── */
// function ConfirmDelete({ onConfirm, onCancel }) {
//   return (
//     <div style={{
//       position: "fixed", inset: 0, zIndex: 200,
//       background: "rgba(15,17,30,.45)", backdropFilter: "blur(3px)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       padding: "20px"
//     }}>
//       <div style={{
//         background: "#fff", borderRadius: "14px", padding: "30px 28px",
//         maxWidth: "380px", width: "100%",
//         boxShadow: "0 20px 50px rgba(0,0,0,.18)"
//       }}>
//         <div style={{ fontSize: "28px", marginBottom: "12px" }}>🗑️</div>
//         <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "15px", color: "#1a1d2e", marginBottom: "6px" }}>
//           Delete this call note?
//         </p>
//         <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#7c8db0", marginBottom: "22px" }}>
//           This action cannot be undone.
//         </p>
//         <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
//           <button className="cn-btn cn-btn-cancel" onClick={onCancel}>Cancel</button>
//           <button className="cn-btn" onClick={onConfirm}
//             style={{ background: "#f43f5e", color: "#fff", boxShadow: "0 2px 8px rgba(244,63,94,.25)" }}>
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ── Main Component ── */
// export const CallNoteRegistration = ({ onToggleSidebar }) => {
//   const [value, setValue]               = useState("")
//   const [items, setItems]               = useState([])
//   const [isEditing, setIsEditing]       = useState(false)
//   const [editId, setEditId]             = useState(null)
//   const [deleteTarget, setDeleteTarget] = useState(null)
//   const inputRef                        = useRef(null)

//   const { data, loading, refreshHook } = UseFetch("/customer/getallcallNotes")

//   useEffect(() => { if (data) setItems(data) }, [data])

//   const resetForm = () => {
//     setValue("")
//     setIsEditing(false)
//     setEditId(null)
//   }

//   const handleEdit = (id) => {
//     const item = items.find((i) => i._id === id)
//     if (!item) return
//     setValue(item.callNotes)
//     setEditId(id)
//     setIsEditing(true)
//     inputRef.current?.focus()
//   }

//   const handleDeleteConfirm = async () => {
//     const id = deleteTarget
//     setDeleteTarget(null)
//     try {
//       await api.delete(`/customer/callnoteDelete?id=${id}`)
//       setItems((prev) => prev.filter((i) => i._id !== id))
//       if (editId === id) resetForm()
//     } catch {
//       toast.error("Failed to delete. Try again.")
//     }
//   }

//   const handleSubmit = async () => {
//     const trimmed = value.trim()
//     if (!trimmed) {
//       toast.error("Call note cannot be empty.")
//       inputRef.current?.focus()
//       return
//     }
//     const formData = { callNotes: trimmed }
//     try {
//       if (isEditing && editId) {
//         await api.put(`/customer/callnotesEdit?id=${editId}`, formData)
//         toast.success("Call note updated successfully")
//       } else {
//         await api.post("/customer/callnotesRegistration", formData)
//         toast.success("Call note created successfully")
//       }
//       resetForm()
//       refreshHook()
//     } catch {
//       toast.error("Something went wrong. Please try again.")
//     }
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSubmit()
//     if (e.key === "Escape") resetForm()
//   }

//   return (
//     <>
//       <style>{styles}</style>

//       {deleteTarget && (
//         <ConfirmDelete
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setDeleteTarget(null)}
//         />
//       )}

//       <div className="cn-root">
//         {/* ── Header ── */}
//         <header className="cn-header">
//           <button className="cn-header-icon" onClick={onToggleSidebar} aria-label="Toggle sidebar">
//             <MenuIcon />
//           </button>
//           <span className="cn-header-title">Manage Call Notes</span>
//           <span className="cn-header-badge">Customer</span>
//         </header>

//         {/* ── Body ── */}
//         <div className="cn-body">
//           <div className="cn-card">

//             {/* Input section */}
//             <div className="cn-input-section">
//               <p className="cn-section-label">
//                 {isEditing ? "Edit Call Note" : "Add New Call Note"}
//               </p>
//               <div className="cn-input-row">
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   className="cn-input"
//                   placeholder="Enter call note…"
//                   value={value}
//                   onChange={(e) => setValue(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   aria-label="Call note"
//                 />
//                 <button className="cn-btn cn-btn-submit" onClick={handleSubmit}>
//                   {isEditing ? "Update" : "Add Call Note"}
//                 </button>
//                 {isEditing && (
//                   <button className="cn-btn cn-btn-cancel" onClick={resetForm}>
//                     Cancel
//                   </button>
//                 )}
//               </div>
//               {isEditing && (
//                 <p className="cn-edit-hint">
//                   <span className="cn-edit-dot" />
//                   Editing mode — press Escape or Cancel to discard
//                 </p>
//               )}
//             </div>

//             {/* Table section */}
//             <div className="cn-table-section">
//               <div className="cn-table-header">
//                 <span className="cn-table-title">
//                   All Call Notes
//                   <span className="cn-count-badge">{loading ? "—" : items.length}</span>
//                 </span>
//               </div>

//               <div className="cn-table-wrap">
//                 <table className="cn-table" role="table">
//                   <thead>
//                     <tr>
//                       <th style={{ width: "60%" }}>Call Note</th>
//                       <th className="center" style={{ width: "20%" }}>Edit</th>
//                       <th className="right"  style={{ width: "20%" }}>Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       Array.from({ length: 4 }).map((_, i) => (
//                         <tr key={i} className="cn-skeleton-row">
//                           <td><div className="cn-skeleton" style={{ width: `${50 + i * 10}%` }} /></td>
//                           <td className="center"><div className="cn-skeleton" style={{ width: 32, height: 32, borderRadius: 7, margin: "auto" }} /></td>
//                           <td className="right"><div className="cn-skeleton" style={{ width: 32, height: 32, borderRadius: 7, marginLeft: "auto" }} /></td>
//                         </tr>
//                       ))
//                     ) : items.length === 0 ? (
//                       <tr>
//                         <td colSpan={3}>
//                           <div className="cn-empty">
//                             <div className="cn-empty-icon">📂</div>
//                             <p className="cn-empty-text">No call notes yet</p>
//                             <p className="cn-empty-sub">Add your first one using the field above</p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       items.map((el) => (
//                         <tr key={el._id}>
//                           <td>
//                             <div className="cn-item-name">
//                               <span className="cn-item-dot" />
//                               <span className="cn-item-text">{el.callNotes}</span>
//                             </div>
//                           </td>
//                           <td className="center">
//                             <div className="cn-actions" style={{ justifyContent: "center" }}>
//                               <button
//                                 className="cn-action-btn cn-action-edit"
//                                 onClick={() => handleEdit(el._id)}
//                                 title={`Edit ${el.callNotes}`}
//                                 aria-label={`Edit ${el.callNotes}`}
//                               >
//                                 <PencilIcon />
//                               </button>
//                             </div>
//                           </td>
//                           <td className="right">
//                             <div className="cn-actions" style={{ justifyContent: "flex-end" }}>
//                               <button
//                                 className="cn-action-btn cn-action-delete"
//                                 onClick={() => setDeleteTarget(el._id)}
//                                 title={`Delete ${el.callNotes}`}
//                                 aria-label={`Delete ${el.callNotes}`}
//                               >
//                                 <TrashIcon />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   )
// }


// import React, { useState, useEffect, useRef } from "react"
// import api from "../../../api/api"
// import UseFetch from "../../../hooks/useFetch"
// import { toast } from "react-toastify"

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

//   .cn-root * {
//     box-sizing: border-box;
//     margin: 0;
//     padding: 0;
//   }

//   .cn-root {
//     font-family: 'DM Sans', sans-serif;
//     background: #ADD8E6;
//     min-height: 100vh;
//     width: 100%;
//     padding: 20px;
//     overflow: hidden;
//     color: #1a1d2e;
//   }

//   /* ───────────────── MAIN CONTAINER ───────────────── */

//   .cn-container {
//     width: 100%;
//     height: 100%;
//     background: #ADD8E6;
//     border-radius: 24px;
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//   }

//   /* ───────────────── HEADER ───────────────── */

//   .cn-header {
//     background: #1a1d2e;
//     padding: 18px 28px;
//     display: flex;
//     align-items: center;
//     gap: 14px;
//     flex-shrink: 0;
//     border-radius: 24px 24px 0 0;
//     box-shadow: 0 1px 0 rgba(255,255,255,.08);
//   }

//   .cn-header-icon {
//     display: none;
//     font-size: 26px;
//     color: #a8b3cf;
//     cursor: pointer;
//     background: none;
//     border: none;
//     line-height: 1;
//   }

//   @media (max-width: 768px) {
//     .cn-header-icon {
//       display: block;
//     }
//   }

//   .cn-header-title {
//     font-size: 15px;
//     font-weight: 600;
//     color: #ffffff;
//     letter-spacing: .5px;
//   }

//   .cn-header-badge {
//     margin-left: auto;
//     background: rgba(99,102,241,.25);
//     color: #a5b4fc;
//     font-size: 11px;
//     font-weight: 600;
//     padding: 3px 10px;
//     border-radius: 20px;
//     letter-spacing: .4px;
//     text-transform: uppercase;
//   }

//   /* ───────────────── BODY ───────────────── */

//   .cn-body {
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     background: #ffffff;
//     border-radius: 0 0 24px 24px;
//     padding: 20px;
//     overflow: hidden;
//   }

//   /* ───────────────── CARD ───────────────── */

//   .cn-card {
//     background: #ffffff;
//     border-radius: 20px;
//     border: 1px solid #e8eaf0;
//     box-shadow: 0 2px 12px rgba(0,0,0,.05);
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//     min-height: 0;
//   }

//   /* ───────────────── INPUT SECTION ───────────────── */

//   .cn-input-section {
//     padding: 28px 28px 24px;
//     border-bottom: 1px solid #f0f1f5;
//   }

//   .cn-section-label {
//     font-size: 11.5px;
//     font-weight: 600;
//     letter-spacing: 1px;
//     text-transform: uppercase;
//     color: #7c8db0;
//     margin-bottom: 14px;
//   }

//   .cn-input-row {
//     display: flex;
//     gap: 10px;
//     align-items: center;
//     flex-wrap: wrap;
//   }

//   .cn-input {
//     flex: 1;
//     min-width: 200px;
//     height: 42px;
//     padding: 0 14px;
//     border: 1.5px solid #e2e5ee;
//     border-radius: 8px;
//     font-size: 14px;
//     font-family: 'DM Sans', sans-serif;
//     color: #1a1d2e;
//     background: #f8f9fc;
//     outline: none;
//     transition: border-color .2s, box-shadow .2s, background .2s;
//   }

//   .cn-input:focus {
//     border-color: #6366f1;
//     background: #fff;
//     box-shadow: 0 0 0 3px rgba(99,102,241,.12);
//   }

//   .cn-input::placeholder {
//     color: #b0b8cc;
//   }

//   /* ───────────────── BUTTONS ───────────────── */

//   .cn-btn {
//     height: 42px;
//     padding: 0 22px;
//     border: none;
//     border-radius: 8px;
//     font-size: 13px;
//     font-weight: 600;
//     cursor: pointer;
//     letter-spacing: .3px;
//     transition: background .18s, transform .12s, box-shadow .18s;
//     white-space: nowrap;
//   }

//   .cn-btn:active {
//     transform: scale(.97);
//   }

//   .cn-btn-submit {
//     background: #6366f1;
//     color: #fff;
//     box-shadow: 0 2px 8px rgba(99,102,241,.25);
//   }

//   .cn-btn-submit:hover {
//     background: #4f46e5;
//     box-shadow: 0 4px 14px rgba(99,102,241,.35);
//   }

//   .cn-btn-cancel {
//     background: #f1f2f6;
//     color: #5a6279;
//   }

//   .cn-btn-cancel:hover {
//     background: #e8eaf0;
//   }

//   /* ───────────────── EDIT HINT ───────────────── */

//   .cn-edit-hint {
//     margin-top: 10px;
//     font-size: 12.5px;
//     color: #7c8db0;
//     display: flex;
//     align-items: center;
//     gap: 6px;
//   }

//   .cn-edit-dot {
//     width: 7px;
//     height: 7px;
//     border-radius: 50%;
//     background: #f59e0b;
//     display: inline-block;
//     animation: cnpulse 1.6s infinite;
//   }

//   @keyframes cnpulse {
//     0%,100% { opacity: 1; }
//     50% { opacity: .35; }
//   }

//   /* ───────────────── TABLE SECTION ───────────────── */

//   .cn-table-section {
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//     overflow: hidden;
//   }

//   .cn-table-header {
//     padding: 14px 28px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     background: #f8f9fc;
//     border-bottom: 1px solid #f0f1f5;
//   }

//   .cn-table-title {
//     font-size: 13px;
//     font-weight: 600;
//     color: #3d4566;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }

//   .cn-count-badge {
//     background: #e8eaf0;
//     color: #5a6279;
//     border-radius: 20px;
//     padding: 2px 9px;
//     font-size: 11.5px;
//     font-weight: 600;
//     font-family: 'DM Mono', monospace;
//   }

//   .cn-table-wrap {
//     overflow-x: auto;
//     overflow-y: auto;
//     flex: 1;
//   }

//   .cn-table {
//     width: 100%;
//     border-collapse: collapse;
//     table-layout: fixed;
//     font-size: 13.5px;
//   }

//   .cn-table thead tr {
//     background: #f8f9fc;
//     border-bottom: 1px solid #e8eaf0;
//   }

//   .cn-table thead th {
//     position: sticky;
//     top: 0;
//     z-index: 2;
//     background: #f8f9fc;
//   }

//   .cn-table th {
//     padding: 13px 20px;
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: .8px;
//     text-transform: uppercase;
//     color: #9099b3;
//   }

//   .cn-table td {
//     padding: 13px 20px;
//     color: #2d3352;
//     vertical-align: middle;
//   }

//   .cn-table th:first-child,
//   .cn-table td:first-child {
//     text-align: left;
//   }

//   .cn-table th:nth-child(2),
//   .cn-table td:nth-child(2) {
//     text-align: center;
//   }

//   .cn-table th:nth-child(3),
//   .cn-table td:nth-child(3) {
//     text-align: right;
//   }

//   .cn-table tbody tr {
//     border-bottom: 1px solid #f3f4f8;
//     transition: background .15s;
//   }

//   .cn-table tbody tr:hover {
//     background: #fafbff;
//   }

//   /* ───────────────── ITEM ───────────────── */

//   .cn-item-name {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//   }

//   .cn-item-dot {
//     width: 8px;
//     height: 8px;
//     border-radius: 50%;
//     background: #6366f1;
//     flex-shrink: 0;
//     opacity: .55;
//   }

//   .cn-item-text {
//     font-weight: 500;
//     color: #1a1d2e;
//     word-break: break-word;
//   }

//   /* ───────────────── ACTIONS ───────────────── */

//   .cn-actions {
//     display: flex;
//     align-items: center;
//     gap: 6px;
//   }

//   .cn-action-btn {
//     width: 32px;
//     height: 32px;
//     border-radius: 7px;
//     border: none;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: background .15s, transform .12s;
//     font-size: 14px;
//   }

//   .cn-action-btn:active {
//     transform: scale(.9);
//   }

//   .cn-action-edit {
//     background: #eef2ff;
//     color: #6366f1;
//   }

//   .cn-action-edit:hover {
//     background: #e0e7ff;
//   }

//   .cn-action-delete {
//     background: #fff1f2;
//     color: #f43f5e;
//   }

//   .cn-action-delete:hover {
//     background: #ffe4e6;
//   }

//   /* ───────────────── EMPTY ───────────────── */

//   .cn-empty {
//     padding: 56px 20px;
//     text-align: center;
//     color: #9099b3;
//   }

//   .cn-empty-icon {
//     font-size: 36px;
//     margin-bottom: 12px;
//     opacity: .55;
//   }

//   .cn-empty-text {
//     font-size: 14px;
//     font-weight: 500;
//   }

//   .cn-empty-sub {
//     font-size: 12.5px;
//     margin-top: 4px;
//     color: #b0b8cc;
//   }

//   /* ───────────────── MOBILE ───────────────── */

//   @media (max-width: 600px) {

//     .cn-root {
//       padding: 12px;
//     }

//     .cn-body {
//       padding: 12px;
//     }

//     .cn-input-row {
//       flex-direction: column;
//       align-items: stretch;
//     }

//     .cn-input,
//     .cn-btn {
//       width: 100%;
//       min-width: unset;
//     }

//     .cn-input-section {
//       padding: 20px 18px;
//     }

//     .cn-table th,
//     .cn-table td {
//       padding: 11px 14px;
//     }
//   }
// `

// const PencilIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
//   </svg>
// )

// const TrashIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="3 6 5 6 21 6"/>
//     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
//     <path d="M10 11v6M14 11v6"/>
//     <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
//   </svg>
// )

// const MenuIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <line x1="3" y1="6" x2="21" y2="6"/>
//     <line x1="3" y1="12" x2="21" y2="12"/>
//     <line x1="3" y1="18" x2="21" y2="18"/>
//   </svg>
// )

// export const CallNoteRegistration = ({ onToggleSidebar }) => {

//   const [value, setValue] = useState("")
//   const [items, setItems] = useState([])
//   const [isEditing, setIsEditing] = useState(false)
//   const [editId, setEditId] = useState(null)

//   const inputRef = useRef(null)

//   const { data, loading, refreshHook } = UseFetch("/customer/getallcallNotes")

//   useEffect(() => {
//     if (data) {
//       setItems(data)
//     }
//   }, [data])

//   const resetForm = () => {
//     setValue("")
//     setIsEditing(false)
//     setEditId(null)
//   }

//   const handleEdit = (id) => {
//     const item = items.find((i) => i._id === id)

//     if (!item) return

//     setValue(item.callNotes)
//     setEditId(id)
//     setIsEditing(true)

//     inputRef.current?.focus()
//   }

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/customer/callnoteDelete?id=\${id}`)

//       setItems((prev) => prev.filter((i) => i._id !== id))

//       toast.success("Call note deleted successfully")

//     } catch {
//       toast.error("Failed to delete")
//     }
//   }

//   const handleSubmit = async () => {

//     const trimmed = value.trim()

//     if (!trimmed) {
//       toast.error("Call note cannot be empty")
//       inputRef.current?.focus()
//       return
//     }

//     const formData = {
//       callNotes: trimmed
//     }

//     try {

//       if (isEditing && editId) {

//         await api.put(
//           `/customer/callnotesEdit?id=${editId}`,
//           formData
//         )

//         toast.success("Call note updated successfully")

//       } else {

//         await api.post(
//           "/customer/callnotesRegistration",
//           formData
//         )

//         toast.success("Call note added successfully")
//       }

//       resetForm()
//       refreshHook()

//     } catch {
//       toast.error("Something went wrong")
//     }
//   }

//   return (
//     <>
//       <style>{styles}</style>

//       <div className="cn-root">

//         <div className="cn-container">

//           {/* HEADER */}

//           <header className="cn-header">

//             <button
//               className="cn-header-icon"
//               onClick={onToggleSidebar}
//             >
//               <MenuIcon />
//             </button>

//             <span className="cn-header-title">
//               Manage Call Notes
//             </span>

//             <span className="cn-header-badge">
//               Customer
//             </span>

//           </header>

//           {/* BODY */}

//           <div className="cn-body">

//             <div className="cn-card">

//               {/* INPUT SECTION */}

//               <div className="cn-input-section">

//                 <p className="cn-section-label">
//                   {isEditing ? "Edit Call Note" : "Add New Call Note"}
//                 </p>

//                 <div className="cn-input-row">

//                   <input
//                     ref={inputRef}
//                     type="text"
//                     className="cn-input"
//                     placeholder="Enter call note..."
//                     value={value}
//                     onChange={(e) => setValue(e.target.value)}
//                   />

//                   <button
//                     className="cn-btn cn-btn-submit"
//                     onClick={handleSubmit}
//                   >
//                     {isEditing ? "Update" : "Add Call Note"}
//                   </button>

//                   {isEditing && (
//                     <button
//                       className="cn-btn cn-btn-cancel"
//                       onClick={resetForm}
//                     >
//                       Cancel
//                     </button>
//                   )}

//                 </div>

//               </div>

//               {/* TABLE SECTION */}

//               <div className="cn-table-section">

//                 <div className="cn-table-header">

//                   <span className="cn-table-title">
//                     All Call Notes

//                     <span className="cn-count-badge">
//                       {items.length}
//                     </span>
//                   </span>

//                 </div>

//                 <div className="cn-table-wrap">

//                   <table className="cn-table">

//                     <thead>
//                       <tr>
//                         <th style={{ width: "60%" }}>
//                           Call Note
//                         </th>

//                         <th style={{ width: "20%" }}>
//                           Edit
//                         </th>

//                         <th style={{ width: "20%" }}>
//                           Delete
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>

//                       {items.map((el) => (

//                         <tr key={el._id}>

//                           <td>
//                             <div className="cn-item-name">

//                               <span className="cn-item-dot" />

//                               <span className="cn-item-text">
//                                 {el.callNotes}
//                               </span>

//                             </div>
//                           </td>

//                           <td>
//                             <div
//                               className="cn-actions"
//                               style={{ justifyContent: "center" }}
//                             >
//                               <button
//                                 className="cn-action-btn cn-action-edit"
//                                 onClick={() => handleEdit(el._id)}
//                               >
//                                 <PencilIcon />
//                               </button>
//                             </div>
//                           </td>

//                           <td>
//                             <div
//                               className="cn-actions"
//                               style={{ justifyContent: "flex-end" }}
//                             >
//                               <button
//                                 className="cn-action-btn cn-action-delete"
//                                 onClick={() => handleDelete(el._id)}
//                               >
//                                 <TrashIcon />
//                               </button>
//                             </div>
//                           </td>

//                         </tr>

//                       ))}

//                     </tbody>

//                   </table>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     </>
//   )
// }

// import React, { useState, useEffect, useRef } from "react"
// import api from "../../../api/api"
// import UseFetch from "../../../hooks/useFetch"
// import { toast } from "react-toastify"

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

//   * {
//     box-sizing: border-box;
//     margin: 0;
//     padding: 0;
//   }

//   html,
//   body,
//   #root {
//     height: 100%;
//     overflow: hidden;
//   }

//   .cn-root {
//     font-family: 'DM Sans', sans-serif;
//     background: #ADD8E6;
//     height: 100vh;
//     width: 100%;
//     padding: 18px;
//     overflow: hidden;
//     color: #1a1d2e;
//   }

//   /* ───────────────── MAIN CONTAINER ───────────────── */

//   .cn-container {
//     width: 100%;
//     max-width: 1050px;
//     height: 100%;
//     margin: 0 auto;
//     background: #ffffff;
//     border-radius: 24px;
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//     box-shadow: 0 10px 35px rgba(0,0,0,.08);
//   }

//   /* ───────────────── HEADER ───────────────── */

//   .cn-header {
//     position: sticky;
//     top: 0;
//     z-index: 40;
//     background: #1a1d2e;
//     padding: 18px 26px;
//     display: flex;
//     align-items: center;
//     gap: 14px;
//     flex-shrink: 0;
//     min-height: 72px;
//   }

//   .cn-header-icon {
//     display: none;
//     font-size: 26px;
//     color: #a8b3cf;
//     cursor: pointer;
//     background: none;
//     border: none;
//     line-height: 1;
//   }

//   @media (max-width: 768px) {
//     .cn-header-icon {
//       display: block;
//     }
//   }

//   .cn-header-title {
//     font-size: 15px;
//     font-weight: 600;
//     color: #ffffff;
//     letter-spacing: .5px;
//   }

//   .cn-header-badge {
//     margin-left: auto;
//     background: rgba(99,102,241,.25);
//     color: #a5b4fc;
//     font-size: 11px;
//     font-weight: 600;
//     padding: 4px 10px;
//     border-radius: 20px;
//     letter-spacing: .4px;
//     text-transform: uppercase;
//   }

//   /* ───────────────── BODY ───────────────── */

//   .cn-body {
//     flex: 1;
//     padding: 18px;
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//     min-height: 0;
//     background: #f4f7fb;
//   }

//   /* ───────────────── CARD ───────────────── */

//   .cn-card {
//     background: #ffffff;
//     border-radius: 18px;
//     border: 1px solid #e7ebf3;
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//     overflow: hidden;
//     min-height: 0;
//   }

//   /* ───────────────── INPUT SECTION ───────────────── */

//   .cn-input-section {
//     padding: 22px;
//     border-bottom: 1px solid #eef1f6;
//     flex-shrink: 0;
//     background: #ffffff;
//   }

//   .cn-section-label {
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: 1px;
//     text-transform: uppercase;
//     color: #7c8db0;
//     margin-bottom: 14px;
//   }

//   .cn-input-row {
//     display: flex;
//     gap: 10px;
//     align-items: center;
//   }

//   .cn-input {
//     flex: 1;
//     height: 44px;
//     padding: 0 14px;
//     border: 1.5px solid #dfe5ef;
//     border-radius: 10px;
//     font-size: 14px;
//     font-family: 'DM Sans', sans-serif;
//     color: #1a1d2e;
//     background: #f8f9fc;
//     outline: none;
//     transition: .2s;
//   }

//   .cn-input:focus {
//     border-color: #6366f1;
//     background: #fff;
//     box-shadow: 0 0 0 4px rgba(99,102,241,.12);
//   }

//   .cn-input::placeholder {
//     color: #b0b8cc;
//   }

//   /* ───────────────── BUTTONS ───────────────── */

//   .cn-btn {
//     height: 44px;
//     padding: 0 20px;
//     border: none;
//     border-radius: 10px;
//     font-size: 13px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: .2s;
//     white-space: nowrap;
//   }

//   .cn-btn-submit {
//     background: #6366f1;
//     color: #fff;
//   }

//   .cn-btn-submit:hover {
//     background: #4f46e5;
//   }

//   .cn-btn-cancel {
//     background: #eef1f6;
//     color: #5a6279;
//   }

//   .cn-btn-cancel:hover {
//     background: #e2e8f0;
//   }

//   /* ───────────────── TABLE SECTION ───────────────── */

//   .cn-table-section {
//     flex: 1;
//     min-height: 0;
//     display: flex;
//     flex-direction: column;
//     overflow: hidden;
//   }

//   .cn-table-header {
//     padding: 16px 22px;
//     background: #f8f9fc;
//     border-bottom: 1px solid #eef1f6;
//     flex-shrink: 0;
//   }

//   .cn-table-title {
//     font-size: 13px;
//     font-weight: 600;
//     color: #3d4566;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }

//   .cn-count-badge {
//     background: #e8eaf0;
//     color: #5a6279;
//     border-radius: 20px;
//     padding: 2px 9px;
//     font-size: 11px;
//     font-weight: 600;
//     font-family: 'DM Mono', monospace;
//   }

//   /* ONLY TABLE SCROLL */

//   .cn-table-wrap {
//     flex: 1;
//     overflow-y: auto;
//     overflow-x: hidden;
//     min-height: 0;
//     background: #fff;
//   }

//   .cn-table-wrap::-webkit-scrollbar {
//     width: 8px;
//   }

//   .cn-table-wrap::-webkit-scrollbar-thumb {
//     background: #cfd6e4;
//     border-radius: 20px;
//   }

//   .cn-table {
//     width: 100%;
//     border-collapse: collapse;
//     table-layout: fixed;
//     font-size: 13px;
//   }

//   .cn-table thead th {
//     position: sticky;
//     top: 0;
//     z-index: 20;
//     background: #f8f9fc;
//     padding: 13px 18px;
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: .8px;
//     text-transform: uppercase;
//     color: #9099b3;
//     border-bottom: 1px solid #e8eaf0;
//   }

//   .cn-table tbody tr {
//     border-bottom: 1px solid #f1f3f7;
//     transition: .15s;
//   }

//   .cn-table tbody tr:hover {
//     background: #fafbff;
//   }

//   .cn-table td {
//     padding: 14px 18px;
//     color: #2d3352;
//     vertical-align: middle;
//   }

//   .cn-table th:first-child,
//   .cn-table td:first-child {
//     width: 70%;
//     text-align: left;
//   }

//   .cn-table th:nth-child(2),
//   .cn-table td:nth-child(2) {
//     width: 15%;
//     text-align: center;
//   }

//   .cn-table th:nth-child(3),
//   .cn-table td:nth-child(3) {
//     width: 15%;
//     text-align: center;
//   }

//   /* ───────────────── ITEM ───────────────── */

//   .cn-item-name {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//   }

//   .cn-item-dot {
//     width: 8px;
//     height: 8px;
//     border-radius: 50%;
//     background: #6366f1;
//     flex-shrink: 0;
//     opacity: .6;
//   }

//   .cn-item-text {
//     font-weight: 500;
//     color: #1a1d2e;
//     word-break: break-word;
//   }

//   /* ───────────────── ACTIONS ───────────────── */

//   .cn-actions {
//     display: flex;
//     justify-content: center;
//   }

//   .cn-action-btn {
//     width: 34px;
//     height: 34px;
//     border-radius: 8px;
//     border: none;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: .18s;
//   }

//   .cn-action-edit {
//     background: #eef2ff;
//     color: #6366f1;
//   }

//   .cn-action-edit:hover {
//     background: #dfe5ff;
//   }

//   .cn-action-delete {
//     background: #fff1f2;
//     color: #f43f5e;
//   }

//   .cn-action-delete:hover {
//     background: #ffe4e6;
//   }

//   /* ───────────────── EMPTY ───────────────── */

//   .cn-empty {
//     padding: 70px 20px;
//     text-align: center;
//     color: #9099b3;
//   }

//   .cn-empty-icon {
//     font-size: 36px;
//     margin-bottom: 12px;
//   }

//   .cn-empty-text {
//     font-size: 14px;
//     font-weight: 600;
//   }

//   /* ───────────────── MOBILE ───────────────── */

//   @media (max-width: 768px) {

//     .cn-root {
//       padding: 10px;
//     }

//     .cn-container {
//       border-radius: 18px;
//     }

//     .cn-body {
//       padding: 10px;
//     }

//     .cn-input-row {
//       flex-direction: column;
//       align-items: stretch;
//     }

//     .cn-input,
//     .cn-btn {
//       width: 100%;
//     }

//     .cn-input-section {
//       padding: 18px;
//     }

//     .cn-table th,
//     .cn-table td {
//       padding: 12px;
//     }

//     .cn-table th:first-child,
//     .cn-table td:first-child {
//       width: 60%;
//     }

//     .cn-table th:nth-child(2),
//     .cn-table td:nth-child(2),
//     .cn-table th:nth-child(3),
//     .cn-table td:nth-child(3) {
//       width: 20%;
//     }
//   }
// `

// const PencilIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
//   </svg>
// )

// const TrashIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="3 6 5 6 21 6"/>
//     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
//     <path d="M10 11v6M14 11v6"/>
//     <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
//   </svg>
// )

// const MenuIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <line x1="3" y1="6" x2="21" y2="6"/>
//     <line x1="3" y1="12" x2="21" y2="12"/>
//     <line x1="3" y1="18" x2="21" y2="18"/>
//   </svg>
// )

// export const CallNoteRegistration = ({ onToggleSidebar }) => {

//   const [value, setValue] = useState("")
//   const [items, setItems] = useState([])
//   const [isEditing, setIsEditing] = useState(false)
//   const [editId, setEditId] = useState(null)

//   const inputRef = useRef(null)

//   const { data, refreshHook } = UseFetch("/customer/getallcallNotes")

//   useEffect(() => {
//     if (data) {
//       setItems(data)
//     }
//   }, [data])

//   const resetForm = () => {
//     setValue("")
//     setIsEditing(false)
//     setEditId(null)
//   }

//   const handleEdit = (id) => {

//     const item = items.find((i) => i._id === id)

//     if (!item) return

//     setValue(item.callNotes)
//     setEditId(id)
//     setIsEditing(true)

//     inputRef.current?.focus()
//   }

//   const handleDelete = async (id) => {

//     try {

//       await api.delete(`/customer/callnoteDelete?id=${id}`)

//       setItems((prev) => prev.filter((i) => i._id !== id))

//       toast.success("Call note deleted successfully")

//     } catch {

//       toast.error("Failed to delete")
//     }
//   }

//   const handleSubmit = async () => {

//     const trimmed = value.trim()

//     if (!trimmed) {
//       toast.error("Call note cannot be empty")
//       inputRef.current?.focus()
//       return
//     }

//     const formData = {
//       callNotes: trimmed
//     }

//     try {

//       if (isEditing && editId) {

//         await api.put(
//           `/customer/callnotesEdit?id=${editId}`,
//           formData
//         )

//         toast.success("Call note updated successfully")

//       } else {

//         await api.post(
//           "/customer/callnotesRegistration",
//           formData
//         )

//         toast.success("Call note added successfully")
//       }

//       resetForm()
//       refreshHook()

//     } catch {

//       toast.error("Something went wrong")
//     }
//   }

//   return (
//     <>
//       <style>{styles}</style>

//       <div className="cn-root">

//         <div className="cn-container">

//           {/* HEADER */}

//           <header className="cn-header">

//             <button
//               className="cn-header-icon"
//               onClick={onToggleSidebar}
//             >
//               <MenuIcon />
//             </button>

//             <span className="cn-header-title">
//               Manage Call Notes
//             </span>

//             <span className="cn-header-badge">
//               Customer
//             </span>

//           </header>

//           {/* BODY */}

//           <div className="cn-body">

//             <div className="cn-card">

//               {/* INPUT SECTION */}

//               <div className="cn-input-section">

//                 <p className="cn-section-label">
//                   {isEditing ? "Edit Call Note" : "Add New Call Note"}
//                 </p>

//                 <div className="cn-input-row">

//                   <input
//                     ref={inputRef}
//                     type="text"
//                     className="cn-input"
//                     placeholder="Enter call note..."
//                     value={value}
//                     onChange={(e) => setValue(e.target.value)}
//                   />

//                   <button
//                     className="cn-btn cn-btn-submit"
//                     onClick={handleSubmit}
//                   >
//                     {isEditing ? "Update" : "Add Call Note"}
//                   </button>

//                   {isEditing && (
//                     <button
//                       className="cn-btn cn-btn-cancel"
//                       onClick={resetForm}
//                     >
//                       Cancel
//                     </button>
//                   )}

//                 </div>

//               </div>

//               {/* TABLE SECTION */}

//               <div className="cn-table-section">

//                 <div className="cn-table-header">

//                   <span className="cn-table-title">
//                     All Call Notes

//                     <span className="cn-count-badge">
//                       {items.length}
//                     </span>
//                   </span>

//                 </div>

//                 <div className="cn-table-wrap">

//                   <table className="cn-table">

//                     <thead>
//                       <tr>
//                         <th>Call Note</th>
//                         <th>Edit</th>
//                         <th>Delete</th>
//                       </tr>
//                     </thead>

//                     <tbody>

//                       {items.length === 0 ? (

//                         <tr>
//                           <td colSpan="3">
//                             <div className="cn-empty">

//                               <div className="cn-empty-icon">
//                                 📂
//                               </div>

//                               <div className="cn-empty-text">
//                                 No Call Notes Found
//                               </div>

//                             </div>
//                           </td>
//                         </tr>

//                       ) : (

//                         items.map((el) => (

//                           <tr key={el._id}>

//                             <td>
//                               <div className="cn-item-name">

//                                 <span className="cn-item-dot" />

//                                 <span className="cn-item-text">
//                                   {el.callNotes}
//                                 </span>

//                               </div>
//                             </td>

//                             <td>
//                               <div className="cn-actions">

//                                 <button
//                                   className="cn-action-btn cn-action-edit"
//                                   onClick={() => handleEdit(el._id)}
//                                 >
//                                   <PencilIcon />
//                                 </button>

//                               </div>
//                             </td>

//                             <td>
//                               <div className="cn-actions">

//                                 <button
//                                   className="cn-action-btn cn-action-delete"
//                                   onClick={() => handleDelete(el._id)}
//                                 >
//                                   <TrashIcon />
//                                 </button>

//                               </div>
//                             </td>

//                           </tr>

//                         ))

//                       )}

//                     </tbody>

//                   </table>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     </>
//   )
// }
import React, { useState, useEffect, useRef } from "react"
import api from "../../../api/api"
import UseFetch from "../../../hooks/useFetch"
import { toast } from "react-toastify"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .cn-root {
    width: 100%;
    height: 91vh;
    overflow: hidden;
    background: #ADD8E6;
    padding: 18px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ───────────────── MAIN CONTAINER ───────────────── */

  .cn-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  /* FIXED INNER CARD */

  .cn-fixed-wrapper {
    width: 100%;
    max-width: 100%;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 10px 35px rgba(0,0,0,.08);
    display: flex;
    flex-direction: column;
  }

  /* ───────────────── HEADER ───────────────── */

  .cn-header {
    position: sticky;
    top: 0;
    z-index: 40;
    flex-shrink: 0;
    height: 62px;
    background: #1a1d2e;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 24px;
  }

  .cn-header-icon {
    display: none;
    border: none;
    background: transparent;
    color: #ffffff;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .cn-header-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .cn-header-title {
    color: #ffffff;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: .5px;
  }

  .cn-header-badge {
    margin-left: auto;
    background: rgba(99,102,241,.25);
    color: #c7d2fe;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .5px;
    text-transform: uppercase;
  }

  /* ───────────────── BODY ───────────────── */

  .cn-body {
    flex: 1;
    overflow: hidden;
    padding: 18px;
    background: #f4f7fb;
    display: flex;
    flex-direction: column;
    min-height: 0;
// max-width: 800px;

  }
// .cn-body {
//   flex: 1;
//   overflow: hidden;
//   padding: 18px;
//   background: #f4f7fb;
//   display: flex;
//   flex-direction: column;
//   min-height: 0;
//   max-width: 800px;

//   /* ADD THESE */
//   width: 100%;
//   margin: 0 auto;
// }

  /* ───────────────── CARD ───────────────── */

  .cn-card {
    flex: 1;
    min-height: 0;
    background: #ffffff;
    border: 1px solid #e6ebf3;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
max-width:800px;
  /* ADD THESE */
  width: 100%;
  margin: 0 auto;
  }

  /* ───────────────── INPUT SECTION ───────────────── */

  .cn-input-section {
    flex-shrink: 0;
    padding: 22px;
    border-bottom: 1px solid #edf1f7;
    background: #ffffff;
  }

  .cn-section-label {
    font-size: 11px;
    font-weight: 700;
    color: #7c8db0;
    margin-bottom: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .cn-input-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .cn-input {
    flex: 1;
    height: 44px;
    border: 1.5px solid #dfe5ef;
    border-radius: 10px;
    padding: 0 14px;
    background: #f8f9fc;
    outline: none;
    font-size: 14px;
    transition: .2s;
  }

  .cn-input:focus {
    border-color: #6366f1;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(99,102,241,.12);
  }

  .cn-btn {
    height: 44px;
    border: none;
    border-radius: 10px;
    padding: 0 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: .2s;
    white-space: nowrap;
  }

  .cn-btn-submit {
    background: #6366f1;
    color: #ffffff;
  }

  .cn-btn-submit:hover {
    background: #4f46e5;
  }

  .cn-btn-cancel {
    background: #eef1f6;
    color: #4b5563;
  }

  .cn-btn-cancel:hover {
    background: #e2e8f0;
  }

  /* ───────────────── TABLE SECTION ───────────────── */

  .cn-table-section {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .cn-table-header {
    flex-shrink: 0;
    padding: 16px 22px;
    background: #f8f9fc;
    border-bottom: 1px solid #edf1f7;
  }

  .cn-table-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #374151;
    font-size: 13px;
    font-weight: 600;
  }

  .cn-count-badge {
    background: #e5e7eb;
    color: #4b5563;
    border-radius: 999px;
    padding: 2px 9px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
  }

  /* ONLY TABLE SCROLL */

  .cn-table-wrap {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .cn-table-wrap::-webkit-scrollbar {
    width: 8px;
  }

  .cn-table-wrap::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 20px;
  }

  .cn-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .cn-table thead th {
    position: sticky;
    top: 0;
    z-index: 40;
    background: #f8f9fc;
    padding: 14px 18px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: .7px;
    text-transform: uppercase;
  }

  .cn-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: .15s;
  }

  .cn-table tbody tr:hover {
    background: #fafbff;
  }

  .cn-table td {
    padding: 14px 18px;
    font-size: 13px;
    color: #1e293b;
    vertical-align: middle;
  }

  .cn-table th:first-child,
  .cn-table td:first-child {
    width: 72%;
    text-align: left;
  }

  .cn-table th:nth-child(2),
  .cn-table td:nth-child(2) {
    width: 14%;
    text-align: center;
  }

  .cn-table th:nth-child(3),
  .cn-table td:nth-child(3) {
    width: 14%;
    text-align: center;
  }

  /* ───────────────── ITEM ───────────────── */

  .cn-item-name {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cn-item-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6366f1;
    flex-shrink: 0;
  }

  .cn-item-text {
    word-break: break-word;
    font-weight: 500;
  }

  /* ───────────────── ACTIONS ───────────────── */

  .cn-actions {
    display: flex;
    justify-content: center;
  }

  .cn-action-btn {
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: .15s;
  }

  .cn-action-edit {
    background: #eef2ff;
    color: #6366f1;
  }

  .cn-action-edit:hover {
    background: #dfe5ff;
  }

  .cn-action-delete {
    background: #fff1f2;
    color: #f43f5e;
  }

  .cn-action-delete:hover {
    background: #ffe4e6;
  }

  /* ───────────────── EMPTY ───────────────── */

  .cn-empty {
    padding: 70px 20px;
    text-align: center;
  }

  .cn-empty-icon {
    font-size: 34px;
    margin-bottom: 12px;
  }

  .cn-empty-text {
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
  }

  /* ───────────────── MOBILE ───────────────── */

  @media (max-width: 768px) {

    .cn-root {
      padding: 10px;
    }

    .cn-fixed-wrapper {
      border-radius: 18px;
    }

    .cn-body {
      padding: 10px;
    }

    .cn-input-row {
      flex-direction: column;
      align-items: stretch;
    }

    .cn-input,
    .cn-btn {
      width: 100%;
    }

    .cn-table th,
    .cn-table td {
      padding: 12px;
    }

    .cn-table th:first-child,
    .cn-table td:first-child {
      width: 60%;
    }

    .cn-table th:nth-child(2),
    .cn-table td:nth-child(2),
    .cn-table th:nth-child(3),
    .cn-table td:nth-child(3) {
      width: 20%;
    }
  }
`

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

export const CallNoteRegistration = ({ onToggleSidebar }) => {

  const [value, setValue] = useState("")
  const [items, setItems] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const inputRef = useRef(null)

  const { data, refreshHook } = UseFetch("/customer/getallcallNotes")

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data])

  const resetForm = () => {
    setValue("")
    setIsEditing(false)
    setEditId(null)
  }

  const handleEdit = (id) => {

    const item = items.find((i) => i._id === id)

    if (!item) return

    setValue(item.callNotes)
    setEditId(id)
    setIsEditing(true)

    inputRef.current?.focus()
  }

  const handleDelete = async (id) => {

    try {

      await api.delete(`/customer/callnoteDelete?id=${id}`)

      setItems((prev) => prev.filter((i) => i._id !== id))

      toast.success("Call note deleted successfully")

    } catch {

      toast.error("Failed to delete")
    }
  }

  const handleSubmit = async () => {

    const trimmed = value.trim()

    if (!trimmed) {
      toast.error("Call note cannot be empty")
      inputRef.current?.focus()
      return
    }

    const formData = {
      callNotes: trimmed
    }

    try {

      if (isEditing && editId) {

        await api.put(
          `/customer/callnotesEdit?id=${editId}`,
          formData
        )

        toast.success("Call note updated successfully")

      } else {

        await api.post(
          "/customer/callnotesRegistration",
          formData
        )

        toast.success("Call note added successfully")
      }

      resetForm()
      refreshHook()

    } catch {

      toast.error("Something went wrong")
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="cn-root">

        <div className="cn-container">

          <div className="cn-fixed-wrapper">

            <header className="cn-header">

              <button
                className="cn-header-icon"
                onClick={onToggleSidebar}
              >
                <MenuIcon />
              </button>

              <span className="cn-header-title">
                Manage Call Notes
              </span>

              <span className="cn-header-badge">
                Customer
              </span>

            </header>

            <div className="cn-body">

              <div className="cn-card">

                <div className="cn-input-section">

                  <p className="cn-section-label">
                    {isEditing ? "Edit Call Note" : "Add New Call Note"}
                  </p>

                  <div className="cn-input-row">

                    <input
                      ref={inputRef}
                      type="text"
                      className="cn-input"
                      placeholder="Enter call note..."
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />

                    <button
                      className="cn-btn cn-btn-submit"
                      onClick={handleSubmit}
                    >
                      {isEditing ? "Update" : "Add Call Note"}
                    </button>

                    {isEditing && (
                      <button
                        className="cn-btn cn-btn-cancel"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </div>

                <div className="cn-table-section">

                  <div className="cn-table-header">

                    <span className="cn-table-title">
                      All Call Notes

                      <span className="cn-count-badge">
                        {items.length}
                      </span>
                    </span>

                  </div>

                  <div className="cn-table-wrap">

                    <table className="cn-table">

                      <thead>
                        <tr>
                          <th>Call Note</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>

                      <tbody>

                        {items.length === 0 ? (

                          <tr>
                            <td colSpan="3">

                              <div className="cn-empty">

                                <div className="cn-empty-icon">
                                  📂
                                </div>

                                <div className="cn-empty-text">
                                  No Call Notes Found
                                </div>

                              </div>

                            </td>
                          </tr>

                        ) : (

                          items.map((el) => (

                            <tr key={el._id}>

                              <td>

                                <div className="cn-item-name">

                                  <span className="cn-item-dot" />

                                  <span className="cn-item-text">
                                    {el.callNotes}
                                  </span>

                                </div>

                              </td>

                              <td>

                                <div className="cn-actions">

                                  <button
                                    className="cn-action-btn cn-action-edit"
                                    onClick={() => handleEdit(el._id)}
                                  >
                                    <PencilIcon />
                                  </button>

                                </div>

                              </td>

                              <td>

                                <div className="cn-actions">

                                  <button
                                    className="cn-action-btn cn-action-delete"
                                    onClick={() => handleDelete(el._id)}
                                  >
                                    <TrashIcon />
                                  </button>

                                </div>

                              </td>

                            </tr>

                          ))

                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}