
import ProductSubDetailsForm from "../../../components/primaryUser/ProductSubDetailsForm"

export default function CategoryRegistration({ onToggleSidebar }) {
  return (
    <div className="h-full">
      <ProductSubDetailsForm tab="brand" onToggleSidebar={onToggleSidebar}/>
    </div>
  )
}
