import { useEffect, useState } from "react"
import api from "../../../api/api"
import { toast } from "react-toastify"
import { useFetcher, useNavigate } from "react-router-dom"
import LeadMaster from "../../common/LeadMaster"
import { StaticSidebar } from "../../../components/primaryUser/StaticSidebar"
import AdminHeader from "../../../header/AdminHeader"
import StaffHeader from "../../../header/StaffHeader"
import { PerformanceModal } from "../../../components/primaryUser/PerformanceModal"
import {
  Eye,
  Phone,
  Mail,
  Settings,
  MessageSquareText,
  User,
  Calendar,
  Clock,
  UserPlus,
  UserCheck,
  IndianRupee,
  BellRing,
  History,
  ChevronDown,
  ChevronRight,
  X
} from "lucide-react"
import UseFetch from "../../../hooks/useFetch"
function LeadRegister() {
  const [loader, setLoader] = useState(false)
  const [popupMessage, setpopUpMessage] = useState("")
  const userData = localStorage.getItem("user")
  const user = JSON.parse(userData)
  const [selectedUserName, setselecteduserName] = useState(null)
  const [selectedcompanyBranch, setselectedcompanyBranch] = useState(
    user?.selected[0]?.branch_id
  )
  const [selectedCategory, setselectedCategory] = useState(null)
  const [selectedDatapopup, setselectedDataPopup] = useState({})
  const [selectedYear, setSelectedYear] = useState(null)
  const [periodMode, setperiodMode] = useState("all")
  const [targetData, settargetData] = useState([])
  console.log(targetData)
  const [openModal, setOpenModal] = useState(false)
  const [productlist, setproductList] = useState([])
  const [achievedproducts, setacheivedProducts] = useState([])
  const [selectedPeriod, setselectedPeriod] = useState("")
  const navigate = useNavigate()
  // reset functions exposed from LeadMaster
  const { data: branchProduct } = UseFetch(
    selectedcompanyBranch &&
      `/product/getallbranchProduct?branch=${selectedcompanyBranch}`
  )

  const handleSubmit = async (leadData, selectedtableLeadData, role) => {
    console.log(leadData)
  
    try {
      const response = await api.post("/lead/leadRegister", {
        assignedto: user?.assignedto,
        leadData,
        role,
        selectedtableLeadData
      })
console.log("Hhhhh")
      if (response.status === 200) {
        toast.success(response && response.data && response.data.message)
        console.log("hhh")
        return { success: true, data: response.data }
        // wait for toast to be visible, then reload
        // setTimeout(() => {
        //   navigate(0) // or window.location.reload()
        // }, 0)
      } else if (response.status === 201) {
        console.log("hhh")
        setpopUpMessage(response.data.message)
        return { success: false, warning: response.data.message }
      }
      setLoader(false)
    } catch (error) {
      console.log("hh")
      console.error("Error creating product:", error)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message) // Display the backend error message
      } else {
        toast.error("An unexpected error occurred. Please try again.") // Fallback message
      }
    }
  }
  const handleMoreClick = (id, name) => {
    const Datas = targetData?.userWiseResults
    console.log(id)
    console.log(name)
    console.log("hh")
    const filteredList = branchProduct
      .filter(
        (item) =>
          item.selected?.some(
            (selectedItem) => String(selectedItem.category_id) === String(id)
          ) || String(item.category_id) === String(id)
      )
      .map((item) => item.productName || item.serviceName)
    console.log(filteredList)
    setproductList(filteredList)
    setselectedCategory({ Id: id, categoryName: name })
    console.log("J")
    console.log(targetData)
    console.log(user?._id)
    const filteredloggedUserItem = Datas.filter(
      (item) => item.userId === user._id
    )
    console.log("hhh")

    console.log(Datas)
    console.log("hhhh")
    console.log(filteredloggedUserItem)
    console.log(id)
    // const filteredselectedCategory =
    //   filteredloggedUserItem[0].categories.filter(
    //     (item) => item.categoryId === id
    //   )
    const filteredselectedCategory = Datas.flatMap(
      (user) => user.categories || []
    ).filter((item) => item.categoryId === id)
    console.log("Hh")
    const summary = filteredselectedCategory.reduce(
      (acc, cur) => {
        acc.target += Number(cur.target || 0)
        acc.achieved += Number(cur.achieved || 0)
        acc.balance += Number(cur.balance || 0)
        return acc
      },
      { target: 0, achieved: 0, balance: 0 }
    )
    console.log("hhh")
    setselectedDataPopup(summary)
    console.log(filteredselectedCategory && filteredselectedCategory.length)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      setacheivedProducts((prev) => [
        ...prev,
        ...filteredselectedCategory.flatMap((item) =>
          (item?.products || []).map((product) => ({
            productname: product.name,
            amount: product.achieved
          }))
        )
      ])
    } else {
      setacheivedProducts([])
    }
    setOpenModal(true)
  }
  const handleSelectedUser = (category, userId, userName) => {
    setselecteduserName(userName)
    setselectedCategory({
      Id: category.Id,
      categoryName: category.categoryName
    })
    const filteredloggedUserItem = data?.userWiseResults.filter(
      (item) => item.userId === userId
    )
    const filteredselectedCategory =
      filteredloggedUserItem[0].categories.filter(
        (item) => item.categoryId === category.Id
      )
    const summary = filteredselectedCategory.reduce(
      (acc, cur) => {
        acc.target += Number(cur.target || 0)
        acc.achieved += Number(cur.achieved || 0)
        acc.balance += Number(cur.balance || 0)
        return acc
      },
      { target: 0, achieved: 0, balance: 0 }
    )

    setselectedDataPopup(summary)
    if (filteredselectedCategory && filteredselectedCategory.length) {
      setacheivedProducts(
        filteredselectedCategory[0]?.products?.map((product) => ({
          productname: product.name,
          amount: product.achieved
        })) || []
      )
    } else {
      setacheivedProducts([])
    }
  }
console.log(selectedcompanyBranch)
  return (
    <div className="h-full bg-[#ADD8E6] overflow-hidden">
      <div className="flex h-full flex-row overflow-hidden">
        <StaticSidebar
          handleMoreClick={handleMoreClick}
          selectedCompanyBranch={selectedcompanyBranch}
          setselectedCompanyBranch={setselectedcompanyBranch}
          parenttargetData={settargetData}
          parentperiodmode={setperiodMode}
          parentyear={setSelectedYear}
          setselectedPeriod={setselectedPeriod}
        />

        <div className="flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden justify-center">
          <header className="flex items-center justify-between ">
            {user?.role?.toLowerCase() === "admin" ? (
              <AdminHeader hide={true} />
            ) : (
              <StaffHeader hide={true} />
            )}

            <div className="flex h-full items-center gap-1.5  pr-3">
              <button className="rounded-full bg-slate-100 p-1.5 transition">
                <Mail size={15} strokeWidth={2.2} />
              </button>

              <div className="relative">
                <button className="rounded-full bg-slate-100 p-1.5 transition">
                  <MessageSquareText size={15} strokeWidth={2.2} />
                </button>
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              </div>

              <button className="rounded-full bg-slate-100 p-1.5 transition">
                <Settings size={15} strokeWidth={2.2} />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUserMenu((prev) => !prev)
                  }}
                  className="rounded-full bg-slate-100 p-1.5 transition"
                >
                  <User size={15} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden  w-full justify-center">
            <LeadMaster
              process="Registration"
              handleleadData={handleSubmit}
              loadingState={loader}
              setLoadingState={setLoader}
              showmessage={popupMessage}
              showpopupMessage={setpopUpMessage}
              selectedcompanyBranch={selectedcompanyBranch}
            />
          </div>
        </div>
        <PerformanceModal
          modalOpen={openModal}
          splitType={targetData?.selectedMeasurementType}
          selectedperiod={selectedPeriod}
          allperiods={targetData?.periods}
          onselectedPeriodChange={(val, val2) => {
            setSelectedMonth(val2)
            setselectedPeriod(val)
          }}
          onMonthChange={(val) => {
            setcategorylist([])
            setacheivedProducts([])
            setselectedDataPopup([])
            setperiodMode(val)
          }}
          onYearChange={(val) => {
            setcategorylist([])
            setacheivedProducts([])
            setselectedDataPopup([])
            setSelectedYear(val)
          }}
          productlist={productlist}
          onClose={() => {
            setselecteduserName(user?.name)
            setacheivedProducts([])
            setOpenModal(false)
          }}
          selectedMonth={periodMode}
          selectedYear={selectedYear}
          summary={{
            target: selectedDatapopup?.target,
            achieved: selectedDatapopup?.achieved,
            balance:
              selectedDatapopup?.achieved > selectedDatapopup?.target
                ? 0
                : selectedDatapopup?.balance
          }}
          products={achievedproducts}
          targetData={targetData?.userWiseResults}
          loggedUser={user}
          selectedUser={selectedUserName}
          category={selectedCategory}
          handleSelectedUser={handleSelectedUser}
        />
      </div>
    </div>
  )
}

export default LeadRegister
