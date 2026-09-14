import React, { useEffect, useState } from "react"
import CompanyListForm from "../../../components/primaryUser/CompanyListform"
import UseFetch from "../../../hooks/useFetch"
import toast from "react-hot-toast"
function CompanyList() {
  const [company, setCompany] = useState([])
  const { data: companyData, loading, error } = UseFetch("/company/getCompany")

  useEffect(() => {
    if (companyData) {
      // Set the data to the state when it is fetched
      setCompany(companyData)
    }
  }, [companyData])

  useEffect(() => {
    if (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Something went wrong!")
      }
    }
  }, [error])

  return (
    <div className="h-full">
      <CompanyListForm companies={company} />
    </div>
  )
}

export default CompanyList
