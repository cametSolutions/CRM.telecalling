// import { useState, useEffect, useMemo } from "react"
// import DeleteAlert from "../../../components/common/DeleteAlert"
// import BarLoader from "react-spinners/BarLoader"
// import Edit from "../../../components/common/Edit"
// import api from "../../../api/api"
// import UseFetch from "../../../hooks/useFetch"
// import { toast } from "react-toastify"
// export default function ServicesRegistration () {
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
// }

import { useState, useEffect, useMemo, useRef } from "react"
import api from "../../../api/api"
import UseFetch from "../../../hooks/useFetch"
import {toast} from "react-toastify"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  .sr-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .sr-root {
    font-family: 'DM Sans', sans-serif;
    background: #ADD8E6;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    color: #1a1d2e;
    display: flex;
padding:20px;
    flex-direction: column;
    
  }
.sr-container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  border-radius: 24px;

  min-height: 0;
}


.sr-header {
  background: #1a1d2e;

  padding: 18px 28px;

  display: flex;
  align-items: center;

  flex-shrink: 0;

  border-radius: 24px 24px 0 0;

  box-shadow: 0 1px 0 rgba(255,255,255,.08);
}

  .sr-title {
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: .5px;
  }

  .sr-badge {
    background: rgba(99,102,241,.18);
    color: #c7d2fe;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }



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

  
.sr-card {
  width: 70%;
  margin: 0 auto;

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

  .sr-form {
    padding: 24px;
    border-bottom: 1px solid #eef2f7;
    flex-shrink: 0;
  }

  .sr-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #7c8db0;
    margin-bottom: 16px;
  }

  .sr-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0,1fr));
    gap: 12px;
  }

  .sr-input,
  .sr-select {
    width: 100%;
    height: 44px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    background: #f8fafc;
    padding: 0 14px;
    font-size: 14px;
    outline: none;
    transition: .2s;
  }

  .sr-input:focus,
  .sr-select:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,102,241,.12);
  }

  .sr-btn-wrap {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .sr-btn {
    height: 44px;
    border: none;
    border-radius: 10px;
    padding: 0 20px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: .2s;
  }

  .sr-btn-primary {
    background: #4f46e5;
    color: #fff;
  }

  .sr-btn-primary:hover {
    background: #4338ca;
  }

  .sr-btn-cancel {
    background: #eef2f7;
    color: #475569;
  }

  .sr-btn-cancel:hover {
    background: #dfe5ee;
  }

  .sr-table-section {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sr-table-header {
    padding: 14px 24px;
    border-bottom: 1px solid #eef2f7;
    background: #f8fafc;
    flex-shrink: 0;
  }

  .sr-table-title {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
  }

  .sr-table-wrap {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  .sr-table {
    width: 100%;
    border-collapse: collapse;
  }

  .sr-table thead th {
    position: sticky;
    top: 0;
    background: #f8fafc;
    z-index: 5;
  }

  .sr-table th {
    padding: 14px 18px;
    text-align: left;
    font-size: 11px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: .8px;
    white-space: nowrap;
  }

  .sr-table td {
    padding: 16px 18px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 14px;
    color: #0f172a;
  }

  .sr-table tr:hover {
    background: #fafbff;
  }

  .sr-center {
    text-align: center;
  }

  .sr-right {
    text-align: right;
  }

  .sr-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .sr-icon-btn {
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: .2s;
  }

  .sr-edit-btn {
    background: #eef2ff;
    color: #4f46e5;
  }

  .sr-edit-btn:hover {
    background: #dfe4ff;
  }

  .sr-delete-btn {
    background: #fff1f2;
    color: #e11d48;
  }

  .sr-delete-btn:hover {
    background: #ffe4e6;
  }

  .sr-empty {
    padding: 70px 20px;
    text-align: center;
    color: #94a3b8;
    font-weight: 600;
  }

  @keyframes popupScale {
    from {
      opacity: 0;
      transform: scale(.92);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 1200px) {
    .sr-grid {
      grid-template-columns: repeat(2, minmax(0,1fr));
    }
  }

  @media (max-width: 768px) {
    .sr-grid {
      grid-template-columns: 1fr;
    }

    .sr-btn-wrap {
      flex-direction: column;
      align-items: stretch;
    }

    .sr-btn {
      width: 100%;
    }

    .sr-body {
      padding: 14px;
    }
  }
`

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

function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(15,23,42,.45)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "18px",
          padding: "28px",
          boxShadow: "0 25px 60px rgba(0,0,0,.18)",
          animation: "popupScale .18s ease"
        }}
      >
        <div
          style={{
            fontSize: "34px",
            marginBottom: "14px"
          }}
        >
          🗑️
        </div>

        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "8px"
          }}
        >
          Delete this service?
        </h3>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            lineHeight: 1.6,
            marginBottom: "24px"
          }}
        >
          This action cannot be undone.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px"
          }}
        >
          <button className="sr-btn sr-btn-cancel" onClick={onCancel}>
            Cancel
          </button>

          <button
            className="sr-btn"
            onClick={onConfirm}
            style={{
              background: "#e11d48",
              color: "#fff"
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ServicesRegistration() {
  const [serviceName, setServiceName] = useState("")
  const [price, setPrice] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [services, setServices] = useState([])
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const inputRef = useRef(null)

  const { data, refreshHook } = UseFetch("/lead/getallServices")

  const { data: companyData } = UseFetch("/company/getCompany")

  useEffect(() => {
    if (data) {
      setServices(data)
      setLoading(false)
    }
  }, [data])

  useEffect(() => {
    const defaultCompany = companyData?.find(
      (company) => company.selectedCompany
    )

    if (defaultCompany) {
      setSelectedCompany(defaultCompany._id)
    }
  }, [companyData])

  const filteredBranches = useMemo(() => {
    return (
      companyData?.find((company) => company._id === selectedCompany)
        ?.branches || []
    )
  }, [companyData, selectedCompany])

  const resetForm = () => {
    setServiceName("")
    setPrice("")
    setSelectedBranch("")
    setEditId(null)
  }

  const handleEdit = (id) => {
    const service = services.find((el) => el._id === id)

    if (!service) return

    setServiceName(service.serviceName || "")
    setPrice(service.price || "")
    setSelectedCompany(service.company?._id || service.company || "")
    setSelectedBranch(service.branch?._id || service.branch || "")
    setEditId(id)

    inputRef.current?.focus()
  }

  const handleSubmit = async () => {
    const trimmed = serviceName.trim()

    if (!trimmed) {
      toast.error("Service name is required")
      inputRef.current?.focus()
      return
    }

    if (!price) {
      toast.error("Price is required")
      return
    }

    if (!selectedCompany) {
      toast.error("Select company")
      return
    }

    if (!selectedBranch) {
      toast.error("Select branch")
      return
    }

    const formData = {
      serviceName: trimmed,
      price,
      company: selectedCompany,
      branch: selectedBranch
    }

    try {
      if (editId) {
        await api.put(`/product/serviceEdit?id=${editId}`, formData)

        toast.success("Service updated successfully")
      } else {
        await api.post("/product/servicesRegistration", formData)

        toast.success("Service added successfully")
      }

      resetForm()
      refreshHook()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/product/serviceDelete?id=${deleteTarget}`)

      setServices((prev) => prev.filter((el) => el._id !== deleteTarget))

      if (editId === deleteTarget) {
        resetForm()
      }

      setDeleteTarget(null)

      toast.success("Service deleted successfully")
    } catch (error) {
      toast.error("Failed to delete service")
    }
  }

  return (
    <>
      <style>{styles}</style>

      {deleteTarget && (
        <ConfirmDelete
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="sr-root">
        <header className="sr-header">
          <span className="sr-title">Services Registration</span>

          <span className="sr-badge">Services</span>
        </header>

        <div className="sr-body">
          <div className="sr-container">
            <div className="sr-card">
              <div className="sr-form">
                <p className="sr-label">
                  {editId ? "Edit Service" : "Add New Service"}
                </p>

                <div className="sr-grid">
                  <input
                    ref={inputRef}
                    type="text"
                    className="sr-input"
                    placeholder="Enter service name"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  />

                  <input
                    type="number"
                    className="sr-input"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />

                  <select
                    className="sr-select"
                    value={selectedCompany}
                    onChange={(e) => {
                      setSelectedCompany(e.target.value)
                      setSelectedBranch("")
                    }}
                  >
                    <option value="">Select Company</option>

                    {companyData?.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>

                  <select
                    className="sr-select"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="">Select Branch</option>

                    {filteredBranches?.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>

                  <div className="sr-btn-wrap">
                    <button
                      className="sr-btn sr-btn-primary"
                      onClick={handleSubmit}
                    >
                      {editId ? "Update" : "Add Service"}
                    </button>

                    {editId && (
                      <button
                        className="sr-btn sr-btn-cancel"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="sr-table-section">
                <div className="sr-table-header">
                  <span className="sr-table-title">
                    All Services ({services.length})
                  </span>
                </div>

                <div className="sr-table-wrap">
                  <table className="sr-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Company</th>
                        <th>Branch</th>
                        <th className="sr-center">Edit</th>
                        <th className="sr-right">Delete</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6}>
                            <div className="sr-empty">Loading...</div>
                          </td>
                        </tr>
                      ) : services.length === 0 ? (
                        <tr>
                          <td colSpan={6}>
                            <div className="sr-empty">No services found</div>
                          </td>
                        </tr>
                      ) : (
                        services.map((el) => (
                          <tr key={el._id}>
                            <td>{el.serviceName}</td>

                            <td>₹ {el.price}</td>

                            <td>{el.company?.companyName || "-"}</td>

                            <td>{el.branch?.branchName || "-"}</td>

                            <td className="sr-center">
                              <div className="sr-actions">
                                <button
                                  className="sr-icon-btn sr-edit-btn"
                                  onClick={() => handleEdit(el._id)}
                                >
                                  <PencilIcon />
                                </button>
                              </div>
                            </td>

                            <td className="sr-right">
                              <div
                                className="sr-actions"
                                style={{
                                  justifyContent: "flex-end"
                                }}
                              >
                                <button
                                  type="button"
                                  className="sr-icon-btn sr-delete-btn"
                                  onClick={() => {
                                    setDeleteTarget(el._id)
                                  }}
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
    </>
  )
}
