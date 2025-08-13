import { useState,useEffect } from "react";
import UseFetch from "../../../hooks/useFetch";

export default function PaymentHistory() {
const [paymentList,setpaymentList]=useState([])
const [historyModal,sethistoryModal]=useState(false)
const [loggedUser,setloggedUser]=useState(null)
const [loggedUserBranches,setloggedUserBranches]=useState([])
const {data:branch}= UseFetch("/branch/getBranch")
console.log(branch)
// const {data}=UseFetch()
useEffect(()=>{
if(branch&&branch.length>0){
console.log("h")
const userData=localStorage.getItem("user")
if(userData.selected){
// console.
}
console.log(userData)
setloggedUser(JSON.parse(userData))

}

},[branch])
console.log(loggedUser)
  return (
    <div>PaymentHistory</div>
  )
}
