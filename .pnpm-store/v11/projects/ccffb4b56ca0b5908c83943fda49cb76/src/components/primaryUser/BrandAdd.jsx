import React, { useState, useEffect } from "react"
//import UseFetch from "../../../hooks/useFetch"
import UseFetch from "../../hooks/useFetch"

import { CiEdit } from "react-icons/ci"
import { MdDelete } from "react-icons/md"
import { useForm } from "react-hook-form"

const BrandAdd = ({
  process,
  BrandData,
  handleBrandData,
  handleEditedData,
  handleDeleteData
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()
  const [brands, setBrands] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [proces, setProces] = useState(process)
  const [editingBrandId, setEditingBrandId] = useState(null)
  const [brandsPerPage] = useState(5)
  const { data, loading, error, refreshHook } = UseFetch("/inventory/getBrand")
  useEffect(() => {
    if (data) {
      setBrands(data.data)
    }
  }, [data])

  const handleEdit = (id) => {
    const brandToEdit = brands.find((brand) => brand._id === id)
    if (brandToEdit) {
      reset({ brandName: brandToEdit.brandName })
      setProces("Edit")
      // Store the ID of the brand being edited
    }
  }

  const onSubmit = async (data) => {
    if (process === "Registration") {
      handleBrandData(data, refreshHook)
    } else if (process === "Edit") {
      handleEditedData(data, editingBrandId, refreshHook)
    } else {
      handleDeleteData(data)
    }
  }

  //   }
  const handleDelete = async (id) => {
    try {
      await api.delete(`/inventory/deleteBrand/${id}`, {
        withCredentials: true
      })

      // Update the state to remove the deleted brand
      setBrands(brands.filter((brand) => brand._id !== id))
      toast.success("Brand deleted successfully!")
    } catch (error) {
      console.error("Error deleting brand:", error)
      toast.error("Failed to delete brand")
    }
  }

  // Pagination logic
  const indexOfLastBrand = currentPage * brandsPerPage
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto p-8">
      <div className="w-ful  bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Add or Edit Brand
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center mb-4"
        >
          <div className="flex-grow mr-4">
            <input
              id="brandName"
              {...register("brandName", { required: "Brand name is required" })}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter brand name"
            />
            {errors.brandName && (
              <span className="text-red-600 text-sm">
                {errors.brandName.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {proces === "Registration" ? "Add Brand" : "Update Brand"}
          </button>
        </form>

        <h2 className="text-xl font-semibold text-center mb-4">Brand List</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Brand Name</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id}>
                <td className="py-2 px-4 border text-black">
                  {brand.brandName}
                </td>
                <td className="py-2 px-4 border text-center">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">
                    <CiEdit onClick={() => handleEdit(brand._id)} />
                  </button>

                  <button className="text-red-500 hover:text-red-700">
                    <MdDelete onClick={() => handleDelete(brand._id)} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {/* <div className="mt-4 flex justify-center">
          {Array.from(
            { length: Math.ceil(brands.length / brandsPerPage) },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-3 py-1 mx-1 border rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {page}
            </button>
          ))}
        </div> */}
      </div>
    </div>
  )
}

export default BrandAdd
