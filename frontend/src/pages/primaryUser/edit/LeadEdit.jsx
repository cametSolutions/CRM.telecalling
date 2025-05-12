import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import LeadMaster from "../../common/LeadMaster"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
function LeadEdit() {
  const [fetcheddata, setfetchedData] = useState([])
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()

  const location = useLocation()
  const { leadId, isReadOnly } = location.state || {}
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)

  useEffect(() => {
    if (leadId) {
      const fetchselectedLeadData = async () => {
        const response = await api.get(`/lead/getSelectedLead?leadId=${leadId}`)

        if (response.status >= 200 && response.status < 300) {
          setfetchedData(response.data.data)
        }
      }
      fetchselectedLeadData()
    }
  }, [])

  const handleSubmit = async (data, leadData, objectId) => {
    try {
      setLoader(true)
      const response = await api.put(
        `/lead/leadRegisterUpdate?docID=${objectId}`,
        {
          data,
          leadData
        }
      )
      if (response.status === 200) {
        toast.success(response.data.message)
        setLoader(false)
      }
      user?.role === "Admin"
        ? navigate("/admin/transaction/lead/leadAllocation")
        : navigate("/staff/transaction/lead/leadFollowUp")
    } catch (error) {
      setLoader(false)
      toast.error("Something went wrong")
      console.error("error:", error)
    }
  }
  return (
    <div>
      {loader && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <LeadMaster
        process="edit"
        handleEditData={handleSubmit}
        editloadingState={loader}
        seteditLoadingState={setLoader}
        Data={fetcheddata}
        isReadOnly={isReadOnly}
      />
    </div>
  )
}

export default LeadEdit
