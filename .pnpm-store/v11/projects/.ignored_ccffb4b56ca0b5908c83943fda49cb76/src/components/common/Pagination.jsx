import React from "react"
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <nav className="mt-4">
      <ul className="flex justify-center">
        {pages.map((page) => (
          <li
            key={page}
            className={`mx-1 ${
              page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-md`}
          >
            <button
              className="px-3 py-1 focus:outline-none focus:ring"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
