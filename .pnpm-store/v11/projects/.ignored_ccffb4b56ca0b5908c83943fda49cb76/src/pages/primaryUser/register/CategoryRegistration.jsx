import ProductSubDetailsForm from "../../../components/primaryUser/ProductSubDetailsForm"

export default function cCategoryRegistration({ onToggleSidebar }) {
  return (
    <div className="h-full bg-[#ADD8E6] p-5">
      <ProductSubDetailsForm tab="category" onToggleSidebar={onToggleSidebar} />
    </div>
  )
}
