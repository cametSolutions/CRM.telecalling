// import { useState, useEffect, useMemo } from "react"
// import DeleteAlert from "../../../components/common/DeleteAlert"
// import BarLoader from "react-spinners/BarLoader"
// import Edit from "../../../components/common/Edit"
// import api from "../../../api/api"
// import UseFetch from "../../../hooks/useFetch"
// import { toast } from "react-toastify"
// export const ServicesRegistration = () => {
//   const [service, setService] = useState("")
//   const [selectedCompany, setSelectedCompany] = useState("")
//   const [selectedBranch, setSelectedBranch] = useState(null)
//   const [price, setPrice] = useState("")
//   const [items, setItems] = useState([])

//   const [editState, seteditState] = useState(true)
//   const [editId, setEditId] = useState("")
//   const { data, loading, error, refreshHook } = UseFetch("/lead/getallServices")
//   const { data: companyData, error: companyError } = UseFetch(
//     "/company/getCompany"
//   )
//   useEffect(() => {
//     if (data) {
//       setItems(data)
//       // setTotalPages(data.data.totalPages)
//     }
//   }, [data])
//   // Set default selected company when data is available
//   useEffect(() => {
//     const defaultCompany = companyData?.find(
//       (company) => company.selectedCompany
//     )
//     if (defaultCompany) {
//       setSelectedCompany(defaultCompany._id)
//     }
//   }, [companyData])

//   const handleEdit = (id) => {
//     seteditState(false)
//     const itemToEdit = items.find((item) => item._id === id)
//     if (itemToEdit) {
//       setValue(itemToEdit.serviceName)
//       setPrice(itemToEdit.price)
//       setEditId(id)

//       // Store the ID of the brand being edited
//     }
//   }
//   const filteredBranches = useMemo(
//     () =>
//       companyData?.find((company) => company._id === selectedCompany)
//         ?.branches || [],
//     [companyData, selectedCompany]
//   )
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/product/serviceDelete?id=${id}`)

//       // Remove the deleted item from the items array
//       setItems((prevItems) => prevItems.filter((item) => item._id !== id))
//       setValue("")
//     } catch (error) {
//       console.error("Failed to delete item", error)
//       // toast.error("Failed to delete item. Please try again.")
//     }
//   }

//   const handleSubmit = async () => {
//     const formData = {
//       serviceName: service,
//       price: price,
//       company: selectedCompany,
//       branch: selectedBranch
//     }

//     try {
//       if (editId) {
//         // Update the existing item

//         await api.put(`/product/serviceEdit?id=${editId}`, formData)

//         toast.success("Service updated successfully")
//         seteditState(true)
//       } else {
//         // Create a new item

//         await api.post("/product/servicesRegistration", formData)

//         toast.success("Service created successfully")
//       }

//       refreshHook()
//       setService("")
//       setPrice("")
//       setEditId(null)
//     } catch (error) {
//       console.error(error)
//       toast.error("Something went wrong")
//     }
//   }

//   return (
//     <div className=" px-1 md:px-8  bg-[#ADD8E6] h-full p-5">
//       {loading && (
//         <BarLoader
//           cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
//           color="#4A90E2" // Change color as needed
//         />
//       )}
//       <div className="bg-white pt-5 rounded-md">
//         <h1 className="text-sm font-bold mb-2 md:mb-6 px-4 md:px-8  text-gray-800 uppercase">
//           ADD SERVICES
//         </h1>

//         <div className="flex flex-col md:flex-row items-center w-full px-4 md:px-8  gap-4">
//           <input
//             type="text"
//             name="serviceName"
//             onChange={(e) => setService(e.target.value.trim())}
//             placeholder="Enter your service name"
//             className="w-full md:w-1/4  p-1  border border-gray-300 rounded focus:border-gray-500 outline-none"
//             value={service || ""}
//           />
//           <input
//             type="number"
//             name="price"
//             placeholder="Enter price.."
//             className="w-full md:w-1/4 p-1 border border-gray-300 rounded focus:border-gray-500 outline-none"
//             value={price || ""}
//             onChange={(e) => setPrice(e.target.value.trim())}
//           />
//           {/* Select Company */}
//           <select
//             className="w-full md:w-1/4 p-1 border border-gray-300 rounded focus:border-gray-500 outline-none"
//             value={selectedCompany || ""}
//             onChange={(e) => setSelectedCompany(e.target.value)}
//           >
//             <option value="">Select Company</option>
//             {companyData?.map((company) => (
//               <option key={company._id} value={company._id}>
//                 {company.companyName}
//               </option>
//             ))}
//           </select>

//           {/* Select Branch (Filtered by Company) */}
//           <select
//             className="w-full md:w-1/4 p-1 border border-gray-300 rounded focus:border-gray-500 outline-none"
//             value={selectedBranch || ""}
//             onChange={(e) => setSelectedBranch(e.target.value)}
//             // disabled={!selectedCompany} // Disable if no company is selected
//           >
//             <option value="">Select Branch</option>

//             {filteredBranches?.map((branch) => (
//               <option key={branch._id} value={branch._id}>
//                 {branch.branchName}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded "
//           >
//             {editState ? "SUBMIT" : "UPDATE"}
//           </button>
//         </div>
//         {items && items.length > 0 ? (
//           <section className="md:m-8 m-3">
//             <div className="w-full xl:mb-0">
//               <div className="relative flex flex-col min-w-0 break-words bg-blue-50 w-full mb-6 p-4 md:p-6 shadow-xl rounded-lg">
//                 <div className="block w-full overflow-x-auto overflow-y-auto h-[calc(85vh-200px)]">
//                   <table className="items-center w-full border border-gray-300 rounded-lg">
//                     <thead>
//                       <tr className="bg-gray-300 sticky top-0 z-10">
//                         <th className="w-3/6 px-6 text-left text-black  py-3 text-sm uppercase whitespace-nowrap font-semibold">
//                           Services
//                         </th>
//                         <th className="w-3/6 px-6 text-left text-black  py-3 text-sm uppercase whitespace-nowrap font-semibold">
//                           Price
//                         </th>
//                         <th className="px-6 w-1/6 text-center text-blue-500 align-middle  py-3 text-sm uppercase  whitespace-nowrap font-semibold">
//                           Edit
//                         </th>
//                         <th className="px-6 w-1/6 text-right text-red-500 align-middle  py-3 text-sm uppercase whitespace-nowrap font-semibold">
//                           Delete
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-gray-100 divide-y divide-gray-300">
//                       {items?.map((el) => (
//                         <tr key={el._id}>
//                           <th className="px-6 text-left col-span-2 text-wrap border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap text-black p-2 text-sm uppercase font-semibold">
//                             {el.serviceName}
//                           </th>
//                           <td className="px-6 text-left text-black p-2">
//                             {el.price}
//                           </td>
//                           <td className="cursor-pointer text-center flex justify-center px-6 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
//                             <Edit onEdit={handleEdit} Id={el._id} />
//                           </td>
//                           <td className="cursor-pointer text-right px-6 border-t-0 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
//                             <DeleteAlert onDelete={handleDelete} Id={el._id} />
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </section>
//         ) : (
//           <div className="text-blue-400 text-center mt-5">
//             Ooops No services Found!...
//           </div>
//         )}
//       </div>
//     </div>
//   )
// // }
// import { useState, useEffect, useMemo, useRef } from "react"
// import BarLoader from "react-spinners/BarLoader"
// import api from "../../../api/api"
// import UseFetch from "../../../hooks/useFetch"
// import { toast } from "react-toastify"

// /* ─────────────────────────────────────────────
//    Inline styles — mirrors ProductSubDetailsForm
// ───────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

//   .sr-root * { box-sizing: border-box; margin: 0; padding: 0; }

//   .sr-root {
//     font-family: 'DM Sans', sans-serif;
//     background: #f8f9fc;
//     min-height: 80vh;
//     color: #1a1d2e;
//   }

//   /* ── Header ── */
//   .sr-header {
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
//   .sr-header-icon {
//     display: none;
//     font-size: 26px;
//     color: #a8b3cf;
//     cursor: pointer;
//     background: none;
//     border: none;
//     line-height: 1;
//   }
//   @media (max-width: 768px) { .sr-header-icon { display: block; } }
//   .sr-header-title {
//     font-size: 15px;
//     font-weight: 600;
//     color: #ffffff;
//     letter-spacing: .5px;
//   }
//   .sr-header-badge {
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
//   .sr-body {
//     max-width: 960px;
//     margin: 0 auto;
//     padding: 32px 24px 60px;
//   }

//   /* ── Card ── */
//   .sr-card {
//     background: #fff;
//     border-radius: 14px;
//     border: 1px solid #e8eaf0;
//     box-shadow: 0 2px 12px rgba(0,0,0,.05);
//     overflow: hidden;
//   }

//   /* ── Input section ── */
//   .sr-input-section {
//     padding: 28px 28px 24px;
//     border-bottom: 1px solid #f0f1f5;
//   }
//   .sr-section-label {
//     font-size: 11.5px;
//     font-weight: 600;
//     letter-spacing: 1px;
//     text-transform: uppercase;
//     color: #7c8db0;
//     margin-bottom: 14px;
//   }
//   .sr-input-row {
//     display: flex;
//     gap: 10px;
//     align-items: center;
//     flex-wrap: wrap;
//   }
//   .sr-input, .sr-select {
//     flex: 1;
//     min-width: 160px;
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
//     appearance: none;
//   }
//   .sr-input:focus, .sr-select:focus {
//     border-color: #6366f1;
//     background: #fff;
//     box-shadow: 0 0 0 3px rgba(99,102,241,.12);
//   }
//   .sr-input::placeholder { color: #b0b8cc; }

//   .sr-select-wrap {
//     flex: 1;
//     min-width: 160px;
//     position: relative;
//   }
//   .sr-select-wrap::after {
//     content: '▾';
//     position: absolute;
//     right: 12px;
//     top: 50%;
//     transform: translateY(-50%);
//     color: #9099b3;
//     pointer-events: none;
//     font-size: 12px;
//   }
//   .sr-select-wrap .sr-select { width: 100%; padding-right: 28px; }

//   .sr-btn {
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
//   .sr-btn:active { transform: scale(.97); }

//   .sr-btn-submit {
//     background: #6366f1;
//     color: #fff;
//     box-shadow: 0 2px 8px rgba(99,102,241,.25);
//   }
//   .sr-btn-submit:hover { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,.35); }

//   .sr-btn-cancel {
//     background: #f1f2f6;
//     color: #5a6279;
//   }
//   .sr-btn-cancel:hover { background: #e8eaf0; }

//   .sr-edit-hint {
//     margin-top: 10px;
//     font-size: 12.5px;
//     color: #7c8db0;
//     display: flex;
//     align-items: center;
//     gap: 6px;
//   }
//   .sr-edit-dot {
//     width: 7px; height: 7px;
//     border-radius: 50%;
//     background: #f59e0b;
//     display: inline-block;
//     animation: srpulse 1.6s infinite;
//   }
//   @keyframes srpulse {
//     0%,100% { opacity: 1; }
//     50%      { opacity: .35; }
//   }

//   /* ── Table section ── */
//   .sr-table-section { overflow: hidden; }

//   .sr-table-header {
//     padding: 14px 28px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     background: #f8f9fc;
//     border-bottom: 1px solid #f0f1f5;
//   }
//   .sr-table-title {
//     font-size: 13px;
//     font-weight: 600;
//     color: #3d4566;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }
//   .sr-count-badge {
//     background: #e8eaf0;
//     color: #5a6279;
//     border-radius: 20px;
//     padding: 2px 9px;
//     font-size: 11.5px;
//     font-weight: 600;
//     font-family: 'DM Mono', monospace;
//   }

//   .sr-table-wrap { overflow-x: auto; }

//   .sr-table {
//     width: 100%;
//     border-collapse: collapse;
//     font-size: 13.5px;
//   }
//   .sr-table thead tr {
//     background: #f8f9fc;
//     border-bottom: 1px solid #e8eaf0;
//   }
//   .sr-table th {
//     padding: 11px 20px;
//     text-align: left;
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: .8px;
//     text-transform: uppercase;
//     color: #9099b3;
//   }
//   .sr-table th.center { text-align: center; }
//   .sr-table th.right  { text-align: right; }

//   .sr-table tbody tr {
//     border-bottom: 1px solid #f3f4f8;
//     transition: background .15s;
//   }
//   .sr-table tbody tr:last-child { border-bottom: none; }
//   .sr-table tbody tr:hover { background: #fafbff; }

//   .sr-table td {
//     padding: 13px 20px;
//     color: #2d3352;
//     vertical-align: middle;
//   }
//   .sr-table td.center { text-align: center; }
//   .sr-table td.right  { text-align: right; }

//   .sr-item-name {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//   }
//   .sr-item-dot {
//     width: 8px; height: 8px;
//     border-radius: 50%;
//     background: #6366f1;
//     flex-shrink: 0;
//     opacity: .55;
//   }
//   .sr-item-text { font-weight: 500; color: #1a1d2e; }

//   .sr-price-chip {
//     display: inline-flex;
//     align-items: center;
//     background: #f0fdf4;
//     color: #16a34a;
//     border-radius: 6px;
//     padding: 3px 10px;
//     font-size: 12.5px;
//     font-weight: 600;
//     font-family: 'DM Mono', monospace;
//     border: 1px solid #bbf7d0;
//   }

//   /* ── Actions ── */
//   .sr-actions { display: flex; align-items: center; gap: 6px; }
//   .sr-action-btn {
//     width: 32px; height: 32px;
//     border-radius: 7px;
//     border: none;
//     cursor: pointer;
//     display: flex; align-items: center; justify-content: center;
//     transition: background .15s, transform .12s;
//     font-size: 14px;
//   }
//   .sr-action-btn:active { transform: scale(.9); }
//   .sr-action-edit   { background: #eef2ff; color: #6366f1; }
//   .sr-action-edit:hover   { background: #e0e7ff; }
//   .sr-action-delete { background: #fff1f2; color: #f43f5e; }
//   .sr-action-delete:hover { background: #ffe4e6; }

//   /* ── Empty state ── */
//   .sr-empty {
//     padding: 56px 20px;
//     text-align: center;
//     color: #9099b3;
//   }
//   .sr-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: .55; }
//   .sr-empty-text { font-size: 14px; font-weight: 500; }
//   .sr-empty-sub  { font-size: 12.5px; margin-top: 4px; color: #b0b8cc; }

//   /* ── Skeleton ── */
//   .sr-skeleton-row td { padding: 13px 20px; }
//   .sr-skeleton {
//     height: 14px;
//     border-radius: 6px;
//     background: linear-gradient(90deg, #f0f1f5 25%, #e8eaf0 50%, #f0f1f5 75%);
//     background-size: 200% 100%;
//     animation: srshimmer 1.4s infinite;
//   }
//   @keyframes srshimmer {
//     0%   { background-position: 200% 0; }
//     100% { background-position: -200% 0; }
//   }

//   @media (max-width: 600px) {
//     .sr-input-row { flex-direction: column; align-items: stretch; }
//     .sr-btn, .sr-select-wrap, .sr-input { width: 100%; min-width: unset; }
//     .sr-body { padding: 20px 14px 50px; }
//     .sr-input-section { padding: 20px 18px; }
//     .sr-table th, .sr-table td { padding: 11px 14px; }
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
//           Delete this service?
//         </p>
//         <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#7c8db0", marginBottom: "22px" }}>
//           This action cannot be undone.
//         </p>
//         <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
//           <button className="sr-btn sr-btn-cancel" onClick={onCancel}>Cancel</button>
//           <button className="sr-btn" onClick={onConfirm}
//             style={{ background: "#f43f5e", color: "#fff", boxShadow: "0 2px 8px rgba(244,63,94,.25)" }}>
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ── Main Component ── */
// export const ServicesRegistration = ({ onToggleSidebar }) => {
//   const [service, setService]             = useState("")
//   const [selectedCompany, setSelectedCompany] = useState("")
//   const [selectedBranch, setSelectedBranch]   = useState(null)
//   const [price, setPrice]                 = useState("")
//   const [items, setItems]                 = useState([])
//   const [isEditing, setIsEditing]         = useState(false)
//   const [editId, setEditId]               = useState(null)
//   const [deleteTarget, setDeleteTarget]   = useState(null)
//   const serviceInputRef                   = useRef(null)

//   const { data, loading, refreshHook }    = UseFetch("/lead/getallServices")
//   const { data: companyData }             = UseFetch("/company/getCompany")

//   useEffect(() => { if (data) setItems(data) }, [data])

//   useEffect(() => {
//     const defaultCompany = companyData?.find((c) => c.selectedCompany)
//     if (defaultCompany) setSelectedCompany(defaultCompany._id)
//   }, [companyData])

//   const filteredBranches = useMemo(
//     () => companyData?.find((c) => c._id === selectedCompany)?.branches || [],
//     [companyData, selectedCompany]
//   )

//   const resetForm = () => {
//     setService("")
//     setPrice("")
//     setIsEditing(false)
//     setEditId(null)
//   }

//   const handleEdit = (id) => {
//     const item = items.find((i) => i._id === id)
//     if (!item) return
//     setService(item.serviceName)
//     setPrice(item.price)
//     setEditId(id)
//     setIsEditing(true)
//     serviceInputRef.current?.focus()
//   }

//   const handleDeleteConfirm = async () => {
//     const id = deleteTarget
//     setDeleteTarget(null)
//     try {
//       await api.delete(`/product/serviceDelete?id=${id}`)
//       setItems((prev) => prev.filter((i) => i._id !== id))
//       if (editId === id) resetForm()
//     } catch {
//       toast.error("Failed to delete. Try again.")
//     }
//   }

//   const handleSubmit = async () => {
//     if (!service.trim()) {
//       toast.error("Service name cannot be empty.")
//       serviceInputRef.current?.focus()
//       return
//     }
//     const formData = {
//       serviceName: service.trim(),
//       price,
//       company: selectedCompany,
//       branch: selectedBranch,
//     }
//     try {
//       if (isEditing && editId) {
//         await api.put(`/product/serviceEdit?id=${editId}`, formData)
//         toast.success("Service updated successfully")
//       } else {
//         await api.post("/product/servicesRegistration", formData)
//         toast.success("Service created successfully")
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

//       <div className="sr-root">
//         {/* ── Header ── */}
//         <header className="sr-header">
//           <button className="sr-header-icon" onClick={onToggleSidebar} aria-label="Toggle sidebar">
//             <MenuIcon />
//           </button>
//           <span className="sr-header-title">Manage Services</span>
//           <span className="sr-header-badge">Inventory</span>
//         </header>

//         {/* ── Loading bar ── */}
//         {loading && (
//           <BarLoader
//             cssOverride={{ width: "100%", height: "3px" }}
//             color="#6366f1"
//           />
//         )}

//         {/* ── Body ── */}
//         <div className="sr-body">
//           <div className="sr-card">

//             {/* Input section */}
//             <div className="sr-input-section">
//               <p className="sr-section-label">
//                 {isEditing ? "Edit Service" : "Add New Service"}
//               </p>
//               <div className="sr-input-row">
//                 <input
//                   ref={serviceInputRef}
//                   type="text"
//                   className="sr-input"
//                   placeholder="Service name…"
//                   value={service}
//                   onChange={(e) => setService(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   aria-label="Service name"
//                 />
//                 <input
//                   type="number"
//                   className="sr-input"
//                   placeholder="Price…"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value.trim())}
//                   onKeyDown={handleKeyDown}
//                   aria-label="Price"
//                 />

//                 <div className="sr-select-wrap">
//                   <select
//                     className="sr-select"
//                     value={selectedCompany}
//                     onChange={(e) => setSelectedCompany(e.target.value)}
//                     aria-label="Select company"
//                   >
//                     <option value="">Select Company</option>
//                     {companyData?.map((c) => (
//                       <option key={c._id} value={c._id}>{c.companyName}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="sr-select-wrap">
//                   <select
//                     className="sr-select"
//                     value={selectedBranch || ""}
//                     onChange={(e) => setSelectedBranch(e.target.value)}
//                     aria-label="Select branch"
//                   >
//                     <option value="">Select Branch</option>
//                     {filteredBranches?.map((b) => (
//                       <option key={b._id} value={b._id}>{b.branchName}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <button className="sr-btn sr-btn-submit" onClick={handleSubmit}>
//                   {isEditing ? "Update" : "Add Service"}
//                 </button>
//                 {isEditing && (
//                   <button className="sr-btn sr-btn-cancel" onClick={resetForm}>
//                     Cancel
//                   </button>
//                 )}
//               </div>
//               {isEditing && (
//                 <p className="sr-edit-hint">
//                   <span className="sr-edit-dot" />
//                   Editing mode — press Escape or Cancel to discard
//                 </p>
//               )}
//             </div>

//             {/* Table section */}
//             <div className="sr-table-section">
//               <div className="sr-table-header">
//                 <span className="sr-table-title">
//                   All Services
//                   <span className="sr-count-badge">{loading ? "—" : items.length}</span>
//                 </span>
//               </div>

//               <div className="sr-table-wrap">
//                 <table className="sr-table" role="table">
//                   <thead>
//                     <tr>
//                       <th style={{ width: "40%" }}>Service Name</th>
//                       <th style={{ width: "20%" }}>Price</th>
//                       <th className="center" style={{ width: "20%" }}>Edit</th>
//                       <th className="right"  style={{ width: "20%" }}>Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       Array.from({ length: 4 }).map((_, i) => (
//                         <tr key={i} className="sr-skeleton-row">
//                           <td><div className="sr-skeleton" style={{ width: `${50 + i * 10}%` }} /></td>
//                           <td><div className="sr-skeleton" style={{ width: "60px" }} /></td>
//                           <td className="center"><div className="sr-skeleton" style={{ width: 32, height: 32, borderRadius: 7, margin: "auto" }} /></td>
//                           <td className="right"><div className="sr-skeleton" style={{ width: 32, height: 32, borderRadius: 7, marginLeft: "auto" }} /></td>
//                         </tr>
//                       ))
//                     ) : items.length === 0 ? (
//                       <tr>
//                         <td colSpan={4}>
//                           <div className="sr-empty">
//                             <div className="sr-empty-icon">📂</div>
//                             <p className="sr-empty-text">No services yet</p>
//                             <p className="sr-empty-sub">Add your first one using the fields above</p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       items.map((el) => (
//                         <tr key={el._id}>
//                           <td>
//                             <div className="sr-item-name">
//                               <span className="sr-item-dot" />
//                               <span className="sr-item-text">{el.serviceName}</span>
//                             </div>
//                           </td>
//                           <td>
//                             <span className="sr-price-chip">₹{el.price}</span>
//                           </td>
//                           <td className="center">
//                             <div className="sr-actions" style={{ justifyContent: "center" }}>
//                               <button
//                                 className="sr-action-btn sr-action-edit"
//                                 onClick={() => handleEdit(el._id)}
//                                 title={`Edit ${el.serviceName}`}
//                                 aria-label={`Edit ${el.serviceName}`}
//                               >
//                                 <PencilIcon />
//                               </button>
//                             </div>
//                           </td>
//                           <td className="right">
//                             <div className="sr-actions" style={{ justifyContent: "flex-end" }}>
//                               <button
//                                 className="sr-action-btn sr-action-delete"
//                                 onClick={() => setDeleteTarget(el._id)}
//                                 title={`Delete ${el.serviceName}`}
//                                 aria-label={`Delete ${el.serviceName}`}
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
// import { useState, useEffect, useMemo, useRef } from "react"
// import BarLoader from "react-spinners/BarLoader"
// import api from "../../../api/api"
// import UseFetch from "../../../hooks/useFetch"
// import { toast } from "react-toastify"

// /* ─────────────────────────────────────────────
//    Inline styles — mirrors ProductSubDetailsForm
// ───────────────────────────────────────────── */

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

//   .sr-root * {
//     box-sizing: border-box;
//     margin: 0;
//     padding: 0;
//   }

//   /* ───────────────── ROOT ───────────────── */
//   .sr-root {
//     font-family: 'DM Sans', sans-serif;

//     width: 100%;
//     height: 100%;

//     background: #ADD8E6;

//     padding: 20px;

//     overflow: hidden;

//     color: #1a1d2e;
//   }

//   /* ───────────────── MAIN CONTAINER ───────────────── */
//   .sr-container {
//     width: 100%;
//     height: 100%;

//     display: flex;
//     flex-direction: column;

//     background: #ADD8E6;

//     border-radius: 24px;

//     overflow: hidden;

//     min-height: 0;
//   }

//   /* ───────────────── HEADER ───────────────── */
//   .sr-header {
//     background: #1a1d2e;

//     padding: 18px 28px;

//     display: flex;
//     align-items: center;
//     gap: 14px;

//     flex-shrink: 0;

//     border-radius: 24px 24px 0 0;

//     box-shadow: 0 1px 0 rgba(255,255,255,.08);
//   }

//   .sr-header-icon {
//     display: none;

//     font-size: 26px;

//     color: #a8b3cf;

//     cursor: pointer;

//     background: none;

//     border: none;

//     line-height: 1;
//   }

//   @media (max-width: 768px) {
//     .sr-header-icon {
//       display: block;
//     }
//   }

//   .sr-header-title {
//     font-size: 15px;
//     font-weight: 600;
//     color: #ffffff;
//     letter-spacing: .5px;
//   }

//   .sr-header-badge {
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
//   .sr-body {
//     flex: 1;

//     display: flex;
//     flex-direction: column;

//     overflow: hidden;

//     padding: 20px;

//     background: #ffffff;
// border-radius:0 0 16px 16px ;

//     min-height: 0;
//   }

//   /* ───────────────── WHITE CARD ───────────────── */
//   .sr-card {
//     width: 100%;

//     flex: 1;

//     background: #ffffff;

//     border-radius: 20px;

//     overflow: hidden;

//     display: flex;
//     flex-direction: column;

//     border: 1px solid #e8eaf0;

//     box-shadow: 0 2px 12px rgba(0,0,0,.05);

//     min-height: 0;
//   }

//   /* ───────────────── INPUT SECTION ───────────────── */
//   .sr-input-section {
//     padding: 28px 28px 24px;

//     border-bottom: 1px solid #f0f1f5;
//   }

//   .sr-section-label {
//     font-size: 11.5px;

//     font-weight: 600;

//     letter-spacing: 1px;

//     text-transform: uppercase;

//     color: #7c8db0;

//     margin-bottom: 14px;
//   }

//   .sr-input-row {
//     display: flex;

//     gap: 10px;

//     align-items: center;

//     flex-wrap: wrap;
//   }

//   .sr-input,
//   .sr-select {
//     flex: 1;

//     min-width: 160px;

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

//     appearance: none;
//   }

//   .sr-input:focus,
//   .sr-select:focus {
//     border-color: #6366f1;

//     background: #fff;

//     box-shadow: 0 0 0 3px rgba(99,102,241,.12);
//   }

//   .sr-input::placeholder {
//     color: #b0b8cc;
//   }

//   .sr-select-wrap {
//     flex: 1;

//     min-width: 160px;

//     position: relative;
//   }

//   .sr-select-wrap::after {
//     content: '▾';

//     position: absolute;

//     right: 12px;

//     top: 50%;

//     transform: translateY(-50%);

//     color: #9099b3;

//     pointer-events: none;

//     font-size: 12px;
//   }

//   .sr-select-wrap .sr-select {
//     width: 100%;

//     padding-right: 28px;
//   }

//   /* ───────────────── BUTTONS ───────────────── */
//   .sr-btn {
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

//   .sr-btn:active {
//     transform: scale(.97);
//   }

//   .sr-btn-submit {
//     background: #6366f1;

//     color: #fff;

//     box-shadow: 0 2px 8px rgba(99,102,241,.25);
//   }

//   .sr-btn-submit:hover {
//     background: #4f46e5;

//     box-shadow: 0 4px 14px rgba(99,102,241,.35);
//   }

//   .sr-btn-cancel {
//     background: #f1f2f6;

//     color: #5a6279;
//   }

//   .sr-btn-cancel:hover {
//     background: #e8eaf0;
//   }

//   /* ───────────────── TABLE SECTION ───────────────── */
//   .sr-table-section {
//     display: flex;

//     flex-direction: column;

//     flex: 1;

//     min-height: 0;

//     overflow: hidden;
//   }

//   .sr-table-header {
//     padding: 14px 28px;

//     display: flex;

//     align-items: center;

//     justify-content: space-between;

//     background: #f8f9fc;

//     border-bottom: 1px solid #f0f1f5;
//   }

//   .sr-table-title {
//     font-size: 13px;

//     font-weight: 600;

//     color: #3d4566;

//     display: flex;

//     align-items: center;

//     gap: 8px;
//   }

//   .sr-count-badge {
//     background: #e8eaf0;

//     color: #5a6279;

//     border-radius: 20px;

//     padding: 2px 9px;

//     font-size: 11.5px;

//     font-weight: 600;

//     font-family: 'DM Mono', monospace;
//   }

//   .sr-table-wrap {
//     overflow-x: auto;

//     overflow-y: auto;

//     flex: 1;

//     min-height: 0;
//   }

//   .sr-table {
//     width: 100%;

//     border-collapse: collapse;

//     font-size: 13.5px;
//   }

//   .sr-table thead tr {
//     background: #f8f9fc;

//     border-bottom: 1px solid #e8eaf0;
//   }

//   .sr-table thead th {
//     position: sticky;

//     top: 0;

//     z-index: 2;

//     background: #f8f9fc;
//   }

//   .sr-table th {
//     padding: 11px 20px;

//     text-align: left;

//     font-size: 11px;

//     font-weight: 700;

//     letter-spacing: .8px;

//     text-transform: uppercase;

//     color: #9099b3;
//   }

//   .sr-table td {
//     padding: 13px 20px;

//     color: #2d3352;

//     vertical-align: middle;
//   }

//   .sr-table tbody tr {
//     border-bottom: 1px solid #f3f4f8;

//     transition: background .15s;
//   }

//   .sr-table tbody tr:hover {
//     background: #fafbff;
//   }

//   .sr-item-name {
//     display: flex;

//     align-items: center;

//     gap: 10px;
//   }

//   .sr-item-dot {
//     width: 8px;
//     height: 8px;

//     border-radius: 50%;

//     background: #6366f1;

//     opacity: .55;
//   }

//   .sr-item-text {
//     font-weight: 500;

//     color: #1a1d2e;
//   }

//   .sr-price-chip {
//     display: inline-flex;

//     align-items: center;

//     background: #f0fdf4;

//     color: #16a34a;

//     border-radius: 6px;

//     padding: 3px 10px;

//     font-size: 12.5px;

//     font-weight: 600;

//     font-family: 'DM Mono', monospace;

//     border: 1px solid #bbf7d0;
//   }

//   /* ───────────────── ACTIONS ───────────────── */
//   .sr-actions {
//     display: flex;

//     align-items: center;

//     gap: 6px;
//   }

//   .sr-action-btn {
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

//   .sr-action-edit {
//     background: #eef2ff;

//     color: #6366f1;
//   }

//   .sr-action-delete {
//     background: #fff1f2;

//     color: #f43f5e;
//   }

//   /* ───────────────── EMPTY ───────────────── */
//   .sr-empty {
//     padding: 56px 20px;

//     text-align: center;

//     color: #9099b3;
//   }

//   .sr-empty-icon {
//     font-size: 36px;

//     margin-bottom: 12px;

//     opacity: .55;
//   }

//   /* ───────────────── MOBILE ───────────────── */
//   @media (max-width: 600px) {

//     .sr-root {
//       padding: 12px;
//     }

//     .sr-body {
//       padding: 12px;
//     }

//     .sr-input-row {
//       flex-direction: column;

//       align-items: stretch;
//     }

//     .sr-btn,
//     .sr-select-wrap,
//     .sr-input {
//       width: 100%;

//       min-width: unset;
//     }

//     .sr-input-section {
//       padding: 20px 18px;
//     }

//     .sr-table th,
//     .sr-table td {
//       padding: 11px 14px;
//     }
//   }
// `

// /* ── Icons ── */
// const PencilIcon = () => (
//   <svg
//     width="14"
//     height="14"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//   </svg>
// )
// const TrashIcon = () => (
//   <svg
//     width="14"
//     height="14"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polyline points="3 6 5 6 21 6" />
//     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//     <path d="M10 11v6M14 11v6" />
//     <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
//   </svg>
// )
// const MenuIcon = () => (
//   <svg
//     width="22"
//     height="22"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//   >
//     <line x1="3" y1="6" x2="21" y2="6" />
//     <line x1="3" y1="12" x2="21" y2="12" />
//     <line x1="3" y1="18" x2="21" y2="18" />
//   </svg>
// )

// /* ── Confirm Delete Modal ── */
// function ConfirmDelete({ onConfirm, onCancel }) {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 200,
//         background: "rgba(15,17,30,.45)",
//         backdropFilter: "blur(3px)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "20px"
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "14px",
//           padding: "30px 28px",
//           maxWidth: "380px",
//           width: "100%",
//           boxShadow: "0 20px 50px rgba(0,0,0,.18)"
//         }}
//       >
//         <div style={{ fontSize: "28px", marginBottom: "12px" }}>🗑️</div>
//         <p
//           style={{
//             fontFamily: "'DM Sans',sans-serif",
//             fontWeight: 600,
//             fontSize: "15px",
//             color: "#1a1d2e",
//             marginBottom: "6px"
//           }}
//         >
//           Delete this service?
//         </p>
//         <p
//           style={{
//             fontFamily: "'DM Sans',sans-serif",
//             fontSize: "13px",
//             color: "#7c8db0",
//             marginBottom: "22px"
//           }}
//         >
//           This action cannot be undone.
//         </p>
//         <div
//           style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
//         >
//           <button className="sr-btn sr-btn-cancel" onClick={onCancel}>
//             Cancel
//           </button>
//           <button
//             className="sr-btn"
//             onClick={onConfirm}
//             style={{
//               background: "#f43f5e",
//               color: "#fff",
//               boxShadow: "0 2px 8px rgba(244,63,94,.25)"
//             }}
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ── Main Component ── */
// export const ServicesRegistration = ({ onToggleSidebar }) => {
//   const [service, setService] = useState("")
//   const [selectedCompany, setSelectedCompany] = useState("")
//   const [selectedBranch, setSelectedBranch] = useState(null)
//   const [price, setPrice] = useState("")
//   const [items, setItems] = useState([])
//   const [isEditing, setIsEditing] = useState(false)
//   const [editId, setEditId] = useState(null)
//   const [deleteTarget, setDeleteTarget] = useState(null)
//   const serviceInputRef = useRef(null)

//   const { data, loading, refreshHook } = UseFetch("/lead/getallServices")
//   const { data: companyData } = UseFetch("/company/getCompany")

//   useEffect(() => {
//     if (data) setItems(data)
//   }, [data])

//   useEffect(() => {
//     const defaultCompany = companyData?.find((c) => c.selectedCompany)
//     if (defaultCompany) setSelectedCompany(defaultCompany._id)
//   }, [companyData])

//   const filteredBranches = useMemo(
//     () => companyData?.find((c) => c._id === selectedCompany)?.branches || [],
//     [companyData, selectedCompany]
//   )

//   const resetForm = () => {
//     setService("")
//     setPrice("")
//     setIsEditing(false)
//     setEditId(null)
//   }

//   const handleEdit = (id) => {
//     const item = items.find((i) => i._id === id)
//     if (!item) return
//     setService(item.serviceName)
//     setPrice(item.price)
//     setEditId(id)
//     setIsEditing(true)
//     serviceInputRef.current?.focus()
//   }

//   const handleDeleteConfirm = async () => {
//     const id = deleteTarget
//     setDeleteTarget(null)
//     try {
//       await api.delete(`/product/serviceDelete?id=${id}`)
//       setItems((prev) => prev.filter((i) => i._id !== id))
//       if (editId === id) resetForm()
//     } catch {
//       toast.error("Failed to delete. Try again.")
//     }
//   }

//   const handleSubmit = async () => {
//     if (!service.trim()) {
//       toast.error("Service name cannot be empty.")
//       serviceInputRef.current?.focus()
//       return
//     }
//     const formData = {
//       serviceName: service.trim(),
//       price,
//       company: selectedCompany,
//       branch: selectedBranch
//     }
//     try {
//       if (isEditing && editId) {
//         await api.put(`/product/serviceEdit?id=${editId}`, formData)
//         toast.success("Service updated successfully")
//       } else {
//         await api.post("/product/servicesRegistration", formData)
//         toast.success("Service created successfully")
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

//       <div className="sr-root">
//         {/* ── Header ── */}
//         <header className="sr-header">
//           <button
//             className="sr-header-icon"
//             onClick={onToggleSidebar}
//             aria-label="Toggle sidebar"
//           >
//             <MenuIcon />
//           </button>
//           <span className="sr-header-title">Manage Services</span>
//           <span className="sr-header-badge">Inventory</span>
//         </header>

//         {/* ── Loading bar ── */}
//         {loading && (
//           <BarLoader
//             cssOverride={{ width: "100%", height: "3px" }}
//             color="#6366f1"
//           />
//         )}

//         {/* ── Body ── */}
//         <div className="sr-body">
//           <div className="sr-card">
//             {/* Input section */}
//             <div className="sr-input-section">
//               <p className="sr-section-label">
//                 {isEditing ? "Edit Service" : "Add New Service"}
//               </p>
//               <div className="sr-input-row">
//                 <input
//                   ref={serviceInputRef}
//                   type="text"
//                   className="sr-input"
//                   placeholder="Service name…"
//                   value={service}
//                   onChange={(e) => setService(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   aria-label="Service name"
//                 />
//                 <input
//                   type="number"
//                   className="sr-input"
//                   placeholder="Price…"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value.trim())}
//                   onKeyDown={handleKeyDown}
//                   aria-label="Price"
//                 />

//                 <div className="sr-select-wrap">
//                   <select
//                     className="sr-select"
//                     value={selectedCompany}
//                     onChange={(e) => setSelectedCompany(e.target.value)}
//                     aria-label="Select company"
//                   >
//                     <option value="">Select Company</option>
//                     {companyData?.map((c) => (
//                       <option key={c._id} value={c._id}>
//                         {c.companyName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="sr-select-wrap">
//                   <select
//                     className="sr-select"
//                     value={selectedBranch || ""}
//                     onChange={(e) => setSelectedBranch(e.target.value)}
//                     aria-label="Select branch"
//                   >
//                     <option value="">Select Branch</option>
//                     {filteredBranches?.map((b) => (
//                       <option key={b._id} value={b._id}>
//                         {b.branchName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <button className="sr-btn sr-btn-submit" onClick={handleSubmit}>
//                   {isEditing ? "Update" : "Add Service"}
//                 </button>
//                 {isEditing && (
//                   <button className="sr-btn sr-btn-cancel" onClick={resetForm}>
//                     Cancel
//                   </button>
//                 )}
//               </div>
//               {isEditing && (
//                 <p className="sr-edit-hint">
//                   <span className="sr-edit-dot" />
//                   Editing mode — press Escape or Cancel to discard
//                 </p>
//               )}
//             </div>

//             {/* Table section */}
//             <div className="sr-table-section">
//               <div className="sr-table-header">
//                 <span className="sr-table-title">
//                   All Services
//                   <span className="sr-count-badge">
//                     {loading ? "—" : items.length}
//                   </span>
//                 </span>
//               </div>

//               <div className="sr-table-wrap">
//                 <table className="sr-table" role="table">
//                   <thead>
//                     <tr>
//                       <th style={{ width: "40%" }}>Service Name</th>
//                       <th style={{ width: "20%" }}>Price</th>
//                       <th className="center" style={{ width: "20%" }}>
//                         Edit
//                       </th>
//                       <th className="right" style={{ width: "20%" }}>
//                         Delete
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       Array.from({ length: 4 }).map((_, i) => (
//                         <tr key={i} className="sr-skeleton-row">
//                           <td>
//                             <div
//                               className="sr-skeleton"
//                               style={{ width: `${50 + i * 10}%` }}
//                             />
//                           </td>
//                           <td>
//                             <div
//                               className="sr-skeleton"
//                               style={{ width: "60px" }}
//                             />
//                           </td>
//                           <td className="center">
//                             <div
//                               className="sr-skeleton"
//                               style={{
//                                 width: 32,
//                                 height: 32,
//                                 borderRadius: 7,
//                                 margin: "auto"
//                               }}
//                             />
//                           </td>
//                           <td className="right">
//                             <div
//                               className="sr-skeleton"
//                               style={{
//                                 width: 32,
//                                 height: 32,
//                                 borderRadius: 7,
//                                 marginLeft: "auto"
//                               }}
//                             />
//                           </td>
//                         </tr>
//                       ))
//                     ) : items.length === 0 ? (
//                       <tr>
//                         <td colSpan={4}>
//                           <div className="sr-empty">
//                             <div className="sr-empty-icon">📂</div>
//                             <p className="sr-empty-text">No services yet</p>
//                             <p className="sr-empty-sub">
//                               Add your first one using the fields above
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       items.map((el) => (
//                         <tr key={el._id}>
//                           <td>
//                             <div className="sr-item-name">
//                               <span className="sr-item-dot" />
//                               <span className="sr-item-text">
//                                 {el.serviceName}
//                               </span>
//                             </div>
//                           </td>
//                           <td>
//                             <span className="sr-price-chip">₹{el.price}</span>
//                           </td>
//                           <td className="center">
//                             <div
//                               className="sr-actions"
//                               style={{ justifyContent: "center" }}
//                             >
//                               <button
//                                 className="sr-action-btn sr-action-edit"
//                                 onClick={() => handleEdit(el._id)}
//                                 title={`Edit ${el.serviceName}`}
//                                 aria-label={`Edit ${el.serviceName}`}
//                               >
//                                 <PencilIcon />
//                               </button>
//                             </div>
//                           </td>
//                           <td className="right">
//                             <div
//                               className="sr-actions"
//                               style={{ justifyContent: "flex-end" }}
//                             >
//                               <button
//                                 className="sr-action-btn sr-action-delete"
//                                 onClick={() => setDeleteTarget(el._id)}
//                                 title={`Delete ${el.serviceName}`}
//                                 aria-label={`Delete ${el.serviceName}`}
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
import { useState, useEffect, useMemo, useRef } from "react"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import UseFetch from "../../../hooks/useFetch"
import { toast } from "react-toastify"

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

.sr-root * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ROOT */
.sr-root {
  font-family: 'DM Sans', sans-serif;

  width: 100%;
  height: 100%;

  background: #ADD8E6;

  padding: 20px;

  overflow: hidden;

  color: #1a1d2e;
}

/* CONTAINER */
.sr-container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  border-radius: 24px;

  min-height: 0;
}

/* HEADER */
.sr-header {
  background: #1a1d2e;

  padding: 18px 28px;

  display: flex;
  align-items: center;
  gap: 14px;

  flex-shrink: 0;

  border-radius: 24px 24px 0 0;

  box-shadow: 0 1px 0 rgba(255,255,255,.08);
}

.sr-header-icon {
  display: none;

  font-size: 26px;

  color: #a8b3cf;

  cursor: pointer;

  background: none;

  border: none;

  line-height: 1;
}

@media (max-width: 768px) {
  .sr-header-icon {
    display: block;
  }
}

.sr-header-title {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: .5px;
}

.sr-header-badge {
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

/* BODY */
.sr-body {
  flex: 1;

  background: #ffffff;

  border-radius: 0 0 24px 24px;

  overflow: hidden;

  display: flex;
  flex-direction: column;

  padding: 20px;

  min-height: 0;
}

/* CARD */
.sr-card {
  width: 100%;

  flex: 1;

  background: #ffffff;

  border-radius: 20px;

  overflow: hidden;

  display: flex;
  flex-direction: column;

  border: 1px solid #e8eaf0;

  box-shadow: 0 2px 12px rgba(0,0,0,.05);

  min-height: 0;
}

/* INPUT SECTION */
.sr-input-section {
  padding: 28px 28px 24px;

  border-bottom: 1px solid #f0f1f5;
}

.sr-section-label {
  font-size: 11.5px;

  font-weight: 600;

  letter-spacing: 1px;

  text-transform: uppercase;

  color: #7c8db0;

  margin-bottom: 14px;
}

.sr-input-row {
  display: flex;

  gap: 10px;

  align-items: center;

  flex-wrap: wrap;
}

.sr-input,
.sr-select {
  flex: 1;

  min-width: 160px;

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

  appearance: none;
}

.sr-input:focus,
.sr-select:focus {
  border-color: #6366f1;

  background: #fff;

  box-shadow: 0 0 0 3px rgba(99,102,241,.12);
}

.sr-input::placeholder {
  color: #b0b8cc;
}

.sr-select-wrap {
  flex: 1;

  min-width: 160px;

  position: relative;
}

.sr-select-wrap::after {
  content: '▾';

  position: absolute;

  right: 12px;

  top: 50%;

  transform: translateY(-50%);

  color: #9099b3;

  pointer-events: none;

  font-size: 12px;
}

.sr-select-wrap .sr-select {
  width: 100%;

  padding-right: 28px;
}

/* BUTTONS */
.sr-btn {
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

.sr-btn:active {
  transform: scale(.97);
}

.sr-btn-submit {
  background: #6366f1;

  color: #fff;

  box-shadow: 0 2px 8px rgba(99,102,241,.25);
}

.sr-btn-submit:hover {
  background: #4f46e5;

  box-shadow: 0 4px 14px rgba(99,102,241,.35);
}

.sr-btn-cancel {
  background: #f1f2f6;

  color: #5a6279;
}

.sr-btn-cancel:hover {
  background: #e8eaf0;
}

/* TABLE SECTION */
.sr-table-section {
  display: flex;
  flex-direction: column;

  flex: 1;

  min-height: 0;

  overflow: hidden;
}

.sr-table-header {
  padding: 14px 28px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #f8f9fc;

  border-bottom: 1px solid #f0f1f5;
}

.sr-table-title {
  font-size: 13px;
  font-weight: 600;

  color: #3d4566;

  display: flex;
  align-items: center;
  gap: 8px;
}

.sr-count-badge {
  background: #e8eaf0;
  color: #5a6279;

  border-radius: 20px;

  padding: 2px 9px;

  font-size: 11.5px;
  font-weight: 600;

  font-family: 'DM Mono', monospace;
}

/* TABLE WRAP */
.sr-table-wrap {
  flex: 1;

  min-height: 0;

  overflow-y: auto;
  overflow-x: auto;
}

/* TABLE */
.sr-table {
  width: 100%;

  border-collapse: collapse;

  table-layout: fixed;

  font-size: 13.5px;
}

/* HEADER */
.sr-table thead tr {
  background: #f8f9fc;

  border-bottom: 1px solid #e8eaf0;
}

.sr-table thead th {
  position: sticky;

  top: 0;

  z-index: 5;

  background: #f8f9fc;
}

/* BOTH */
.sr-table th,
.sr-table td {
  padding: 13px 20px;

  vertical-align: middle;
}

/* TH */
.sr-table th {
  font-size: 11px;

  font-weight: 700;

  letter-spacing: .8px;

  text-transform: uppercase;

  color: #9099b3;
}

/* TD */
.sr-table td {
  color: #2d3352;
}

/* ROWS */
.sr-table tbody tr {
  border-bottom: 1px solid #f3f4f8;

  transition: background .15s;
}

.sr-table tbody tr:hover {
  background: #fafbff;
}

/* COLUMNS */
.sr-col-service {
  width: 40%;
  text-align: left;
}

.sr-col-price {
  width: 20%;
  text-align: left;
}

.sr-col-edit {
  width: 20%;
  text-align: center;
}

.sr-col-delete {
  width: 20%;
  text-align: right;
}

/* SERVICE */
.sr-item-name {
  display: flex;

  align-items: center;

  gap: 10px;
}

.sr-item-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #6366f1;

  opacity: .55;

  flex-shrink: 0;
}

.sr-item-text {
  font-weight: 500;

  color: #1a1d2e;
}

/* PRICE */
.sr-price-chip {
  display: inline-flex;

  align-items: center;

  background: #f0fdf4;

  color: #16a34a;

  border-radius: 6px;

  padding: 3px 10px;

  font-size: 12.5px;

  font-weight: 600;

  font-family: 'DM Mono', monospace;

  border: 1px solid #bbf7d0;
}

/* ACTIONS */
.sr-actions {
  display: flex;

  align-items: center;
}

.sr-actions-center {
  justify-content: center;
}

.sr-actions-right {
  justify-content: flex-end;
}

.sr-action-btn {
  width: 32px;
  height: 32px;

  border-radius: 7px;

  border: none;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background .15s, transform .12s;

  font-size: 14px;
}

.sr-action-edit {
  background: #eef2ff;

  color: #6366f1;
}

.sr-action-delete {
  background: #fff1f2;

  color: #f43f5e;
}

/* EMPTY */
.sr-empty {
  padding: 56px 20px;

  text-align: center;

  color: #9099b3;
}

.sr-empty-icon {
  font-size: 36px;

  margin-bottom: 12px;

  opacity: .55;
}

.sr-empty-text {
  font-size: 14px;

  font-weight: 500;
}

.sr-empty-sub {
  font-size: 12.5px;

  margin-top: 4px;

  color: #b0b8cc;
}

/* MOBILE */
@media (max-width: 600px) {

  .sr-root {
    padding: 12px;
  }

  .sr-body {
    padding: 12px;
  }

  .sr-input-row {
    flex-direction: column;

    align-items: stretch;
  }

  .sr-btn,
  .sr-select-wrap,
  .sr-input {
    width: 100%;

    min-width: unset;
  }

  .sr-input-section {
    padding: 20px 18px;
  }

  .sr-table th,
  .sr-table td {
    padding: 11px 14px;
  }
}
`

/* ICONS */

const PencilIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

/* COMPONENT */

export const ServicesRegistration = ({ onToggleSidebar }) => {

  const [service, setService] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [price, setPrice] = useState("")
  const [items, setItems] = useState([])

  const serviceInputRef = useRef(null)

  const { data, loading } = UseFetch("/lead/getallServices")
  const { data: companyData } = UseFetch("/company/getCompany")

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data])

  const filteredBranches = useMemo(
    () =>
      companyData?.find(
        (c) => c._id === selectedCompany
      )?.branches || [],
    [companyData, selectedCompany]
  )

  return (
    <>
      <style>{styles}</style>

      <div className="sr-root">

        <div className="sr-container">

          {/* HEADER */}
          <header className="sr-header">

            <button
              className="sr-header-icon"
              onClick={onToggleSidebar}
            >
              <MenuIcon />
            </button>

            <span className="sr-header-title">
              Manage Services
            </span>

            <span className="sr-header-badge">
              Inventory
            </span>

          </header>

          {/* LOADING */}
          {loading && (
            <BarLoader
              cssOverride={{
                width: "100%",
                height: "3px"
              }}
              color="#6366f1"
            />
          )}

          {/* BODY */}
          <div className="sr-body">

            <div className="sr-card">

              {/* INPUT */}
              <div className="sr-input-section">

                <p className="sr-section-label">
                  Add New Service
                </p>

                <div className="sr-input-row">

                  <input
                    ref={serviceInputRef}
                    type="text"
                    className="sr-input"
                    placeholder="Service name..."
                    value={service}
                    onChange={(e) =>
                      setService(e.target.value)
                    }
                  />

                  <input
                    type="number"
                    className="sr-input"
                    placeholder="Price..."
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                  />

                  <div className="sr-select-wrap">
                    <select
                      className="sr-select"
                      value={selectedCompany}
                      onChange={(e) =>
                        setSelectedCompany(e.target.value)
                      }
                    >
                      <option value="">
                        Select Company
                      </option>

                      {companyData?.map((c) => (
                        <option
                          key={c._id}
                          value={c._id}
                        >
                          {c.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sr-select-wrap">
                    <select
                      className="sr-select"
                      value={selectedBranch}
                      onChange={(e) =>
                        setSelectedBranch(e.target.value)
                      }
                    >
                      <option value="">
                        Select Branch
                      </option>

                      {filteredBranches?.map((b) => (
                        <option
                          key={b._id}
                          value={b._id}
                        >
                          {b.branchName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button className="sr-btn sr-btn-submit">
                    Add Service
                  </button>

                </div>

              </div>

              {/* TABLE */}
              <div className="sr-table-section">

                <div className="sr-table-header">

                  <span className="sr-table-title">

                    All Services

                    <span className="sr-count-badge">
                      {loading ? "—" : items.length}
                    </span>

                  </span>

                </div>

                <div className="sr-table-wrap">

                  <table className="sr-table">

                    <thead>
                      <tr>

                        <th className="sr-col-service">
                          Service Name
                        </th>

                        <th className="sr-col-price">
                          Price
                        </th>

                        <th className="sr-col-edit">
                          Edit
                        </th>

                        <th className="sr-col-delete">
                          Delete
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {items.map((el) => (

                        <tr key={el._id}>

                          <td className="sr-col-service">

                            <div className="sr-item-name">

                              <span className="sr-item-dot" />

                              <span className="sr-item-text">
                                {el.serviceName}
                              </span>

                            </div>

                          </td>

                          <td className="sr-col-price">

                            <span className="sr-price-chip">
                              ₹{el.price}
                            </span>

                          </td>

                          <td className="sr-col-edit">

                            <div className="sr-actions sr-actions-center">

                              <button className="sr-action-btn sr-action-edit">
                                <PencilIcon />
                              </button>

                            </div>

                          </td>

                          <td className="sr-col-delete">

                            <div className="sr-actions sr-actions-right">

                              <button className="sr-action-btn sr-action-delete">
                                <TrashIcon />
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}
