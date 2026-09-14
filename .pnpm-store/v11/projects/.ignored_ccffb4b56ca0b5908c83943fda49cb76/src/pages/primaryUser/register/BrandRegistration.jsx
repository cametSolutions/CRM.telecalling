
import ProductSubDetailsForm from "../../../components/primaryUser/ProductSubDetailsForm"

export default function CategoryRegistration({ onToggleSidebar }) {
  return (
    <div className="h-full min-h-0 bg-[#ADD8E6] p-5 overflow-hidden">
      <ProductSubDetailsForm tab="brand" onToggleSidebar={onToggleSidebar}/>
    </div>
  )
}
