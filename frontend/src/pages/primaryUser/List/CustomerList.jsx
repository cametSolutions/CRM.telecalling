// import React, { useEffect, useState } from "react"
// import CustomerListform from "../../../components/secondaryUser/CustomerListform"
// import UseFetch from "../../../hooks/useFetch"
// import toast from "react-hot-toast"
// function CustomerList() {
//   const [customers, setCustomers] = useState([])
//   const {
//     data: customerData,
//     loading,
//     error
//   } = UseFetch("/customer/getCustomer")

//   // useEffect(() => {
//   //   if (customerData) {
//   //     // Set the data to the state when it is fetched
//   //     setCustomers(customerData)
//   //   }
//   // }, [customerData])

//   useEffect(() => {
//     if (error) {
//       if (error.response) {
//         toast.error(error.response.data.message)
//       } else {
//         toast.error("Something went wrong!")
//       }
//     }
//   }, [error])

//   return (
//     <div>
//       <CustomerListform customerlist={customerData} />
//     </div>
//   )
// }

// export default CustomerList
