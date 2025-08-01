import { IoReorderThreeSharp } from "react-icons/io5"
import ProductSubDetailsForm from "../../../components/primaryUser/ProductSubDetailsForm"

export default function BrandRegistration() {
  return (
    <div className=" ">
      <div className="bg-[#201450] py-3 px-5 sticky top-0 z-100  text-white text-lg font-bold  items-center flex flex-grow">
        <IoReorderThreeSharp
          // onClick={handleToggleSidebar}
          className="block md:hidden text-3xl"
        />
        <p>Add Brand</p>
      </div>

      <ProductSubDetailsForm tab={"brand"} />
      {/* <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div> */}
    </div>
  )
}
