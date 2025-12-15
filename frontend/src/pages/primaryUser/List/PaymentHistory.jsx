import { useState,useEffect } from "react";
import UseFetch from "../../../hooks/useFetch";

export default function PaymentHistory() {
const [paymentList,setpaymentList]=useState([])
const [historyModal,sethistoryModal]=useState(false)
const [loggedUser,setloggedUser]=useState(null)
const [loggedUserBranches,setloggedUserBranches]=useState([])
const {data:branch}= UseFetch("/branch/getBranch")
useEffect(()=>{
if(branch&&branch.length>0){
const userData=localStorage.getItem("user")
if(userData.selected){
// console.
}
setloggedUser(JSON.parse(userData))

}

},[branch])
  return (
    <div>PaymentHistory</div>
  )
}
