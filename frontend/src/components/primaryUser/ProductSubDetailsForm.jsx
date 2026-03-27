// import { useState, useEffect } from "react"
// import DeleteAlert from "../common/DeleteAlert"
// import Edit from "../common/Edit"
// import api from "../../api/api"
// import UseFetch from "../../hooks/useFetch"
// import toast from "react-hot-toast"
// export default function ProductSubDetailsForm({ tab }) {
//   const [value, setValue] = useState("")
//   const [items, setItems] = useState([])

//   const [editState, seteditState] = useState(true)
//   const [editId, setEditId] = useState("")
//   const { data, refreshHook } = UseFetch(
//     `/inventory/getproductsubDetails?tab=${tab}`
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
//       // reset({ brandName: brandToEdit.brandName })
//       setValue(itemToEdit[tab])
//       setEditId(id)

//       // Store the ID of the brand being edited
//     }
//   }
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/inventory/productSubdetailsDelete?tab=${tab}&id=${id}`)

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
//       [tab]: value
//     }

//     try {
//       if (editId) {
//         // Update the existing item

//         await api.put(
//           `/inventory/productSubdetailsEdit?tab=${tab}&id=${editId}`,
//           formData
//         )

//         toast.success(`${tab.toUpperCase()} updated successfully`)
//         seteditState(true)
//       } else {
//         // Create a new item

//         await api.post("/inventory/productSubdetailsRegistration", formData)

//         toast.success(`${tab.toUpperCase()} created successfully`)
//       }
     
//       refreshHook()
    
//       setEditId(null)
//     } catch (error) {
//       console.error(error)
//       toast.error("Something went wrong")
//     }
//   }

//   return (
//     <div>
//       <h1 className="text-sm font-bold mb-6  text-gray-800 px-6 pt-6  uppercase">
//         ADD YOUR DESIRED {tab}
//       </h1>

//       <div className="flex items-center  w-full px-6  ">
//         <input
//           type="text"
        
//           onChange={(e) => {
//             handleChange(e)
//           }}
//           placeholder="Enter your brand name"
//           className="w-full md:w-1/2  p-1  border border-gray-300 rounded focus:border-gray-500 outline-none"
//           value={value}
//           //   onChange={(e) => setValue(e.target.value)}
//         />
//         <div className="flex justify-between m-4">
//           <button
          
//             onClick={handleSubmit}
//             className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded "
//           >
//             {editState ? "SUBMIT" : "UPDATE"}
//           </button>
//         </div>
//       </div>
//       <section className=" m-8 ">
//         <div className="w-full xl:mb-0 ">
//           <div className="relative flex flex-col min-w-0 break-words bg-red-50 w-full mb-6 shadow-xl  rounded">
//             <div className=" mb-0 px-4 py-3 border-0">
//               <div className="flex flex-wrap items-center">
//                 <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
//                   <button
//                     className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none  mb-1 ease-linear transition-all duration-150"
//                     type="button"
//                   >
//                     See all
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="block w-full  overflow-x-auto">
//               <table className="items-center  w-full border-collapse">
//                 <thead>
//                   <tr>
//                     <th className=" w-3/6  px-6 text-left  text-black border border-solid border-black py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
//                       {tab}
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
//                         {el[tab]}
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
//       </section>
//     </div>
//   )
// }
import { useState, useEffect, useRef } from "react"
import DeleteAlert from "../common/DeleteAlert"
import Edit from "../common/Edit"
import api from "../../api/api"
import UseFetch from "../../hooks/useFetch"
import toast from "react-hot-toast"

/* ─────────────────────────────────────────────
   Inline styles (no extra CSS file needed)
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .psdf-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .psdf-root {
    font-family: 'DM Sans', sans-serif;
    background:#f8f9fc;
    min-height:80vh;
    color: #1a1d2e;
  }

  /* ── Header ── */
  .psdf-header {
    background: #1a1d2e;
    padding: 18px 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    position: sticky;
    top: 0;
    z-index: 40;
    box-shadow: 0 1px 0 rgba(255,255,255,.08);
  }
  .psdf-header-icon {
    display: none;
    font-size: 26px;
    color: #a8b3cf;
    cursor: pointer;
    background: none;
    border: none;
    line-height: 1;
  }
  @media (max-width: 768px) { .psdf-header-icon { display: block; } }
  .psdf-header-title {
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: .5px;
    text-transform: capitalize;
  }
  .psdf-header-badge {
    margin-left: auto;
    background: rgba(99,102,241,.25);
    color: #a5b4fc;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: .4px;
    text-transform: uppercase;
  }

  /* ── Page body ── */
  .psdf-body {
    max-width: 860px;
    margin: 0 auto;
    padding: 32px 24px 60px;
  }

  /* ── Card ── */
  .psdf-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e8eaf0;
    box-shadow: 0 2px 12px rgba(0,0,0,.05);
    overflow: hidden;
  }

  /* ── Input section ── */
  .psdf-input-section {
    padding: 28px 28px 24px;
    border-bottom: 1px solid #f0f1f5;
  }
  .psdf-section-label {
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #7c8db0;
    margin-bottom: 14px;
  }
  .psdf-input-row {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  .psdf-input {
    flex: 1;
    min-width: 200px;
    height: 42px;
    padding: 0 14px;
    border: 1.5px solid #e2e5ee;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1d2e;
    background: #f8f9fc;
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .psdf-input:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,102,241,.12);
  }
  .psdf-input::placeholder { color: #b0b8cc; }

  .psdf-btn {
    height: 42px;
    padding: 0 22px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: .3px;
    transition: background .18s, transform .12s, box-shadow .18s;
    white-space: nowrap;
  }
  .psdf-btn:active { transform: scale(.97); }

  .psdf-btn-submit {
    background: #6366f1;
    color: #fff;
    box-shadow: 0 2px 8px rgba(99,102,241,.25);
  }
  .psdf-btn-submit:hover { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,.35); }

  .psdf-btn-cancel {
    background: #f1f2f6;
    color: #5a6279;
  }
  .psdf-btn-cancel:hover { background: #e8eaf0; }

  .psdf-edit-hint {
    margin-top: 10px;
    font-size: 12.5px;
    color: #7c8db0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .psdf-edit-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #f59e0b;
    display: inline-block;
    animation: pulse 1.6s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50% { opacity: .35; }
  }

  /* ── Table section ── */
  .psdf-table-section { overflow: hidden; }

  .psdf-table-header {
    padding: 14px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f9fc;
    border-bottom: 1px solid #f0f1f5;
  }
  .psdf-table-title {
    font-size: 13px;
    font-weight: 600;
    color: #3d4566;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .psdf-count-badge {
    background: #e8eaf0;
    color: #5a6279;
    border-radius: 20px;
    padding: 2px 9px;
    font-size: 11.5px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
  }

  .psdf-table-wrap { overflow-x: auto; }

  .psdf-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  .psdf-table thead tr {
    background: #f8f9fc;
    border-bottom: 1px solid #e8eaf0;
  }
  .psdf-table th {
    padding: 11px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .8px;
    text-transform: uppercase;
    color: #9099b3;
  }
  .psdf-table th.center { text-align: center; }
  .psdf-table th.right  { text-align: right; }

  .psdf-table tbody tr {
    border-bottom: 1px solid #f3f4f8;
    transition: background .15s;
  }
  .psdf-table tbody tr:last-child { border-bottom: none; }
  .psdf-table tbody tr:hover { background: #fafbff; }

  .psdf-table td {
    padding: 13px 20px;
    color: #2d3352;
    vertical-align: middle;
  }
  .psdf-table td.center { text-align: center; }
  .psdf-table td.right  { text-align: right; }

  .psdf-item-name {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .psdf-item-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6366f1;
    flex-shrink: 0;
    opacity: .55;
  }
  .psdf-item-text {
    font-weight: 500;
    color: #1a1d2e;
  }

  /* ── Actions ── */
  .psdf-actions { display: flex; align-items: center; justify-content: center; gap: 6px; }
  .psdf-action-btn {
    width: 32px; height: 32px;
    border-radius: 7px;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s, transform .12s;
    font-size: 14px;
  }
  .psdf-action-btn:active { transform: scale(.9); }
  .psdf-action-edit  { background: #eef2ff; color: #6366f1; }
  .psdf-action-edit:hover  { background: #e0e7ff; }
  .psdf-action-delete { background: #fff1f2; color: #f43f5e; }
  .psdf-action-delete:hover { background: #ffe4e6; }

  /* ── Empty state ── */
  .psdf-empty {
    padding: 56px 20px;
    text-align: center;
    color: #9099b3;
  }
  .psdf-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: .55; }
  .psdf-empty-text { font-size: 14px; font-weight: 500; }
  .psdf-empty-sub  { font-size: 12.5px; margin-top: 4px; color: #b0b8cc; }

  /* ── Skeleton loader ── */
  .psdf-skeleton-row td { padding: 13px 20px; }
  .psdf-skeleton {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f0f1f5 25%, #e8eaf0 50%, #f0f1f5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 480px) {
    .psdf-input-row { flex-direction: column; align-items: stretch; }
    .psdf-btn { width: 100%; }
    .psdf-body { padding: 20px 14px 50px; }
    .psdf-input-section { padding: 20px 18px; }
    .psdf-table th, .psdf-table td { padding: 11px 14px; }
  }
`

/* ─────────────────────────────────────────────
   Icon helpers (inline SVG — no icon lib dep)
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   Confirm-delete modal (replaces DeleteAlert)
───────────────────────────────────────────── */
function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(15,17,30,.45)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff", borderRadius: "14px", padding: "30px 28px",
        maxWidth: "380px", width: "100%",
        boxShadow: "0 20px 50px rgba(0,0,0,.18)"
      }}>
        <div style={{ fontSize: "28px", marginBottom: "12px" }}>🗑️</div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "15px", color: "#1a1d2e", marginBottom: "6px" }}>
          Delete this item?
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#7c8db0", marginBottom: "22px" }}>
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button className="psdf-btn psdf-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="psdf-btn" onClick={onConfirm}
            style={{ background: "#f43f5e", color: "#fff", boxShadow: "0 2px 8px rgba(244,63,94,.25)" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function ProductSubDetailsForm({ tab, onToggleSidebar }) {
  const [value, setValue] = useState("")
  const [items, setItems] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const inputRef = useRef(null)

  const { data, refreshHook } = UseFetch(`/inventory/getproductsubDetails?tab=${tab}`)

  useEffect(() => {
    if (data) {
      setItems(data)
      setLoading(false)
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
    setValue(item[tab])
    setEditId(id)
    setIsEditing(true)
    inputRef.current?.focus()
  }

  const handleDeleteConfirm = async () => {
    const id = deleteTarget
    setDeleteTarget(null)
    try {
      await api.delete(`/inventory/productSubdetailsDelete?tab=${tab}&id=${id}`)
      setItems((prev) => prev.filter((i) => i._id !== id))
      if (editId === id) resetForm()
    } catch {
      toast.error("Failed to delete. Try again.")
    }
  }

  const handleSubmit = async () => {
    const trimmed = value.trim()
    if (!trimmed) {
      toast.error("Field cannot be empty.")
      inputRef.current?.focus()
      return
    }
    const formData = { [tab]: trimmed }
    try {
      if (isEditing && editId) {
        await api.put(`/inventory/productSubdetailsEdit?tab=${tab}&id=${editId}`, formData)
        toast.success(`${tab} updated successfully`)
      } else {
console.log("hhh")
        await api.post("/inventory/productSubdetailsRegistration", formData)
        toast.success(`${tab} added successfully`)
      }
      resetForm()
      refreshHook()
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit()
    if (e.key === "Escape") resetForm()
  }

  const label = tab.charAt(0).toUpperCase() + tab.slice(1)

  return (
    <>
      <style>{styles}</style>

      {deleteTarget && (
        <ConfirmDelete
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="psdf-root">
        {/* ── Header ── */}
        <header className="psdf-header">
          <button className="psdf-header-icon" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <MenuIcon />
          </button>
          <span className="psdf-header-title">Manage {label}s</span>
          <span className="psdf-header-badge">Inventory</span>
        </header>

        {/* ── Body ── */}
        <div className="psdf-body">
          <div className="psdf-card">

            {/* Input section */}
            <div className="psdf-input-section">
              <p className="psdf-section-label">
                {isEditing ? `Edit ${label}` : `Add New ${label}`}
              </p>
              <div className="psdf-input-row">
                <input
                  ref={inputRef}
                  type="text"
                  className="psdf-input"
                  placeholder={`Enter ${label.toLowerCase()} name…`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label={`${label} name`}
                />
                <button className="psdf-btn psdf-btn-submit" onClick={handleSubmit}>
                  {isEditing ? "Update" : `Add ${label}`}
                </button>
                {isEditing && (
                  <button className="psdf-btn psdf-btn-cancel" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
              {isEditing && (
                <p className="psdf-edit-hint">
                  <span className="psdf-edit-dot" />
                  Editing mode — press Escape or Cancel to discard
                </p>
              )}
            </div>

            {/* Table section */}
            <div className="psdf-table-section">
              <div className="psdf-table-header">
                <span className="psdf-table-title">
                  All {label}s
                  <span className="psdf-count-badge">{loading ? "—" : items.length}</span>
                </span>
              </div>

              <div className="psdf-table-wrap">
                <table className="psdf-table" role="table">
                  <thead>
                    <tr>
                      <th style={{ width: "60%" }}>{label} Name</th>
                      <th className="center" style={{ width: "20%" }}>Edit</th>
                      <th className="right"  style={{ width: "20%" }}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i} className="psdf-skeleton-row">
                          <td><div className="psdf-skeleton" style={{ width: `${55 + i * 10}%` }} /></td>
                          <td className="center"><div className="psdf-skeleton" style={{ width: 32, height: 32, borderRadius: 7, margin: "auto" }} /></td>
                          <td className="right"><div className="psdf-skeleton" style={{ width: 32, height: 32, borderRadius: 7, marginLeft: "auto" }} /></td>
                        </tr>
                      ))
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan={3}>
                          <div className="psdf-empty">
                            <div className="psdf-empty-icon">📂</div>
                            <p className="psdf-empty-text">No {label.toLowerCase()}s yet</p>
                            <p className="psdf-empty-sub">Add your first one using the field above</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      items.map((el) => (
                        <tr key={el._id}>
                          <td>
                            <div className="psdf-item-name">
                              <span className="psdf-item-dot" />
                              <span className="psdf-item-text">{el[tab]}</span>
                            </div>
                          </td>
                          <td className="center">
                            <div className="psdf-actions">
                              <button
                                className="psdf-action-btn psdf-action-edit"
                                onClick={() => handleEdit(el._id)}
                                title={`Edit ${el[tab]}`}
                                aria-label={`Edit ${el[tab]}`}
                              >
                                <PencilIcon />
                              </button>
                            </div>
                          </td>
                          <td className="right">
                            <div className="psdf-actions" style={{ justifyContent: "flex-end" }}>
                              <button
                                className="psdf-action-btn psdf-action-delete"
                                onClick={() => setDeleteTarget(el._id)}
                                title={`Delete ${el[tab]}`}
                                aria-label={`Delete ${el[tab]}`}
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
    </>
  )
}
