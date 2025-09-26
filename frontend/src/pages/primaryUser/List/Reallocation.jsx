import { useState, useEffect } from "react"
import ReallocationTable from "./ReallocationTable"
import { useNavigate } from "react-router-dom"

import { AiOutlineProfile } from "react-icons/ai"
import { toast } from "react-toastify"
import { PropagateLoader } from "react-spinners"
import BarLoader from "react-spinners/BarLoader"
import api from "../../../api/api"
import Select from "react-select"
import UseFetch from "../../../hooks/useFetch"
const Reallocation = () => {
  const [status, setStatus] = useState("Pending")
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [showTableList, setshowTableList] = useState(false)
  const [gridList, setgridList] = useState([])
  const [toggleLoading, setToggleLoading] = useState(false)
  const [selectedLeadId, setselectedLeadId] = useState(null)
  const [selectedType, setselectedType] = useState(null)
  const [showModal, setShowmodal] = useState(false)
  const [submiterror, setsubmitError] = useState("")
  const [selectedAllocationType, setselectedAllocationType] = useState({})
  const [validateError, setValidateError] = useState({})
  const [validatetypeError, setValidatetypeError] = useState({})
  const [loggedUserBranches, setLoggeduserBranches] = useState([])
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null)
  const [showFullName, setShowFullName] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [approvedToggleStatus, setapprovedToggleStatus] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const [allocationOptions, setAllocationOptions] = useState([])
  const [selectedAllocates, setSelectedAllocates] = useState({})
  const [loggedUser, setLoggedUser] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [tableData, setTableData] = useState([])
  const { data: branches } = UseFetch("/branch/getBranch")
  const [formData, setFormData] = useState({
    allocationDate: "",
    allocationDescription: ""
  })
  const {
    data: leadreallocation,
    loading,
    refreshHook
  } = UseFetch(
    loggedUser &&
      selectedCompanyBranch &&
      `/lead/getallreallocatedLead?selectedBranch=${selectedCompanyBranch}&role=${loggedUser.role}`
  )
  const { data } = UseFetch("/auth/getallUsers")
  const navigate = useNavigate()
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = JSON.parse(userData)
    setLoggedUser(user)
  }, [])

  useEffect(() => {
    if (loggedUser && branches && branches.length > 0) {
      if (loggedUser.role === "Admin") {
        const isselctedArray = loggedUser?.selected
        if (isselctedArray) {
          const loggeduserBranches = loggedUser.selected.map((item) => {
            return { value: item.branch_id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(loggeduserBranches[0].value)
        } else {
          const loggeduserBranches = branches.map((item) => {
            return { value: item._id, label: item.branchName }
          })
          setLoggeduserBranches(loggeduserBranches)
          setSelectedCompanyBranch(loggeduserBranches[0].value)
        }
      } else {
        const loggeduserBranches = loggedUser.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName }
        })
        setLoggeduserBranches(loggeduserBranches)
        setSelectedCompanyBranch(loggeduserBranches[0].value)
      }
    }
  }, [loggedUser, branches])
  useEffect(() => {
    if (data && selectedCompanyBranch) {
      const { allusers = [], allAdmins = [] } = data

      // Combine allusers and allAdmins

      const filter = allusers.filter((staff) =>
        staff.selected.some((s) => selectedCompanyBranch === s.branch_id)
      )
      const combinedUsers = [...filter, ...allAdmins]
      setAllocationOptions(
        combinedUsers.map((item) => ({
          value: item._id,
          label: item.name
        }))
      )
    }
  }, [data, selectedCompanyBranch])
  useEffect(() => {
    if (leadreallocation && leadreallocation.length > 0) {
      const taskByList = leadreallocation.reduce((acc, lead) => {
        const logs = lead.activityLog
        if (logs.length === 0) return acc

        const lastTask = logs[logs.length - 1]
        const taskBy = lastTask.taskBy

        if (taskBy) {
          acc[taskBy] = (acc[taskBy] || 0) + 1
        }

        return acc
      }, {})
      // Convert to array of objects with label and value
      const taskByCountArray = Object.entries(taskByList).map(
        ([label, value]) => ({
          label,
          value
        })
      )
      setgridList(taskByCountArray)
      setTableData(leadreallocation)
    }
  }, [leadreallocation])

  const handleSelectedAllocates = (item, value) => {
    setTableData((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === item._id ? { ...lead, allocatedTo: value } : lead
      )
    )
  }

  const handleSubmit = async () => {
    try {
      if (!selectedAllocates.hasOwnProperty(selectedItem._id)) {
        setValidateError((prev) => ({
          ...prev,
          [selectedItem._id]: "Allocate to Someone"
        }))
        return
      }
      if (!selectedAllocationType.hasOwnProperty(selectedItem._id)) {
        setValidatetypeError((prev) => ({
          ...prev,
          [selectedItem._id]: "Select Type"
        }))
        return
      }
      const selected = selectedAllocationType[selectedItem._id]
      setsubmitLoading(true)
      // return
      // const selected = selectedAllocationType[selectedItem._id]
      const response = await api.post(
        `/lead/leadReallocation?allocationType=${encodeURIComponent(
          selected
        )}&allocatedBy=${loggedUser._id}`,
        { selectedItem, formData }
      )
      toast.success(response.data.message)
      setsubmitLoading(false)
      setFormData({
        allocationDate: "",
        allocationDescription: ""
      })
      setShowmodal(false)
      refreshHook()
      setTableData([])
    } catch (error) {
      setsubmitLoading(false)
      console.log(error)
      setsubmitError({ submissionerror: "something went error" })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {(submitLoading || loading) && (
        <BarLoader
          cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
          color="#4A90E2" // Change color as needed
        />
      )}
      <h2 className="text-lg font-bold ml-5 mt-3">ReAllocation List</h2>

      <div className="border border-gray-100 p-3 mx-4 rounded-xl shadow-xl bg-white  ">
        {gridList &&
          gridList.length > 0 &&
          gridList.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-3 bg-slate-100 p-3 rounded-md shadow-sm text-black text-lg cursor-pointer"
              >
                <div className="bg-blue-500 text-white rounded-full p-2 md:mr-10">
                  <AiOutlineProfile className="text-xl " />
                </div>
                <div
                  onClick={() =>
                    navigate(
                      loggedUser.role === "Admin"
                        ? `/admin/transaction/lead/reallocationTable/${encodeURIComponent(
                            item.label
                          )}`
                        : `/staff/transaction/lead/reallocationTable/${encodeURIComponent(
                            item.label
                          )}`
                    )
                  }
                  className="flex justify-between w-full px-6 py-2 bg-white shadow-xl rounded-md border border-gray-100"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-600">{item.value}</span>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Reallocation
