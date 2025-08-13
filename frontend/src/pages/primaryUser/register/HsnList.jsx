import { useEffect, useState } from "react"
import api from "../../../api/api"
import DeleteAlert from "../../../components/common/DeleteAlert"
import { IoReorderThreeSharp } from "react-icons/io5"
import { CiEdit } from "react-icons/ci"
import { Link } from "react-router-dom"
import UseFetch from "../../../hooks/useFetch"
import { useNavigate } from "react-router-dom"


function HsnList() {
  const [hsn, setHsn] = useState([])


  const { data,  refreshHook } = UseFetch(`/inventory/hsnlist`)

  const navigate = useNavigate()
 

  useEffect(() => {
    if (data) {
      setHsn(data)
    }
  }, [data])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/inventory/hsndelete?id=${id}`)
      refreshHook()
    } catch (error) {
      console.error("Failed to delete item", error)
      // toast.error("Failed to delete item. Please try again.")
    }
  }
  const handleEdit = (id) => {
    seteditState(false)
    const itemToEdit = items.find((item) => item._id === id)
    if (itemToEdit) {
      // reset({ brandName: brandToEdit.brandName })
      setValue(itemToEdit[tab])
      setEditId(id)

      // Store the ID of the brand being edited
    }
  }
  //   useEffect(() => {
  //     const fetchHsn = async () => {
  //       try {
  //         const res = await api.get(`/inventory/fetchHsn/${orgId}`, {
  //           withCredentials: true,
  //         })

  //         setHsn(res.data.data)

  //         // console.log(res.data.organizationData);
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     }
  //     fetchHsn()
  //     dispatch(removeAll())
  //     dispatch(removeAllSales())
  //   }, [orgId, refresh])

  //   const { handleToggleSidebar } = useSidebar()

  //   //   const handleDelete = async (hsnId) => {

  //   //       try {
  //   //         const res = await api.delete(
  //   //          ` /api/pUsers/deleteHsn/${hsnId}`,

  //   //           {
  //   //             withCredentials: true,
  //   //           }
  //   //         );
  //   //         console.log(res);
  //   //         setRefresh(!refresh);
  //   //         Swal.fire({
  //   //           title: "Done!",
  //   //           text: res.data.message,
  //   //           icon: "success",
  //   //         });
  //   //       } catch (error) {
  //   //         console.error(error);
  //   //         Swal.fire({
  //   //           title: "Error!",
  //   //           text: ${error.response.data.message},
  //   //           icon: "error",
  //   //         });
  //   //       }
  //   //     }
  //   //   };
 

  return (
    <section className="antialiased text-gray-600">
      <div className="md:hidden sticky top-0  text-white mb-2 p-3 flex items-center gap-3 text-lg">
        <IoReorderThreeSharp
          //onClick={handleToggleSidebar}
          className="block md:hidden text-3xl cursor-pointer"
        />
        <div className="flex items-center justify-between w-full">
          <p>HSN</p>
          <Link to="/admin/masters/inventory/hsnCreation">
            <button className=" flex gap-2 bg-green-500 px-2 py-1 rounded-md text-sm hover:scale-105 duration-100 ease-in-out hover:bg-green-600 mr-3">
              Add HSN
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col h-full">
        {/* <!-- Table --> */}
        <div className="w-full  shadow-lg  ">
          <header className="hidden md:block px-5 py-3  bg-[#261b56] text-white">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">HSN</h2>

              <Link to="/admin/masters/inventory/hsnCreation">
                <button className="flex gap-2 bg-green-500 px-2 py-1 rounded-md text-sm  hover:bg-green-600">
                  Add HSN
                </button>
              </Link>
            </div>
          </header>

          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">HSN Name</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">IGST Rate</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Edit</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Delete</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm leading-[40px] divide-y divide-gray-100">
                  {hsn.length > 0 ? (
                    hsn.map((hsnData, index) => (
                      <tr key={index}>
                        <td className="p-2 whitespace-nowrap text-black">
                          {hsnData.hsnSac}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {hsnData?.onValue?.igstRate}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <CiEdit
                            className="hover:cursor-pointer"
                            onClick={() =>
                              navigate("/admin/masters/inventory/editHsn", {
                                state: { hsnData: hsnData },
                              })
                            }
                          />
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <DeleteAlert
                            onDelete={handleDelete}
                            Id={hsnData._id}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="text-center"
                        style={{ marginTop: "20px" }}
                        colSpan={5}
                      >
                        No HSN found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {/* <Pagination
            postPerPage={postPerPage}
            totalPosts={hsn.length}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          /> */}
        </div>
      </div>
    </section>
  )
}

export default HsnList
