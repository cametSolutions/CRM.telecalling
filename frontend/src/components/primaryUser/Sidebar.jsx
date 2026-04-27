
import React, { useState } from "react"
import { Menu, ChevronLeft, ChevronRight } from "lucide-react"

import CategoryListIconFirst from "./CategoryListIconFirst"
import CategoryDetailsModal from "./CategoryDetailsModal"

const Sidebar = ({
  handleMoreClick,
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
  setAvatarOpen
}) => {
console.log(categorylist)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleCategoryClick = (categoryId, categoryName) => {
    const category = categorylist.find(
      (cat) => String(cat.categoryId) === String(categoryId)
    )

    setSelectedCategory(category)
    setModalOpen(true)

    if (handleMoreClick) {
      handleMoreClick(categoryId, categoryName)
    }
  }

  return (
    <>
      <aside
        className={`
          flex flex-col border-r border-teal-900/40
          bg-gradient-to-b from-[#0f766e] to-[#115e59] text-white
          transition-[width] duration-200 ease-in-out
          lg:h-full lg:flex-shrink-0
          ${sidebarOpen ? "w-full lg:w-[240px]" : "w-full lg:w-[64px]"}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2.5 lg:hidden">
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-200 transition hover:bg-white/10"
          >
            <Menu size={16} strokeWidth={2.2} />
          </button>
        </div>

        {/* Desktop collapse button */}
        <div className="hidden lg:flex justify-end px-2 pt-2">
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
        </div>

        {/* Top section (compressed) */}
        <div
          className={`
            shrink-0
            ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            transition-opacity duration-150
          `}
        >
          {/* Profile + Branch */}
          <div className="px-3 pb-2 pt-1.5">
            <div className="flex items-center gap-2.5 rounded-lg bg-white/10 px-2.5 py-1.5 shadow-sm ring-1 ring-white/10">
              <button
                type="button"
                onClick={() => setAvatarOpen(true)}
                className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <img
                  src={
                    user?.profileUrl ||
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </button>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[12px] font-semibold leading-4 text-white">
                  {user?.name || "John Smith"}
                </h3>
                <p className="mt-0.5 text-[10px] font-medium leading-4 text-slate-300">
                  Marketing Executive
                </p>
              </div>
            </div>

            <div className="mt-1.5">
              <BranchSelect
                value={selectedBranch}
                onChange={setselectedBranch}
                options={branchOptions}
              />
            </div>
          </div>

          {/* Score board compact card */}
          <div className="px-3">
            <div className="mt-1 rounded-lg bg-slate-950/80 px-3 py-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-300">
                  Score Board
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {categorylist?.length || 0} categories
                </span>
              </div>

              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] font-medium leading-4 text-slate-200">
                  Achieved Points
                </span>
                <span className="text-[16px] font-semibold leading-none text-white">
                  {achievedPoints}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category content — more space now */}
        <div
          className={`
            min-h-0 flex-1
            ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            transition-opacity duration-150
          `}
        >
          {targetLoading ? (
            <div className="p-3">
              <SkeletonTable rows={6} columns={2} />
            </div>
          ) : (
            <div className="h-full overflow-y-auto px-2 py-2">
              <CategoryListIconFirst
                categorylist={categorylist}
                handleMoreClick={handleMoreClick}
                sidebarOpen={sidebarOpen}
              />
            </div>
          )}
        </div>
      </aside>

      <CategoryDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        category={selectedCategory}
      />
    </>
  )
}

export default Sidebar
