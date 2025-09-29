import { useState } from "react"
import { useForm } from "react-hook-form"
import api from "../../../api/api"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { FaSpinner } from "react-icons/fa"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"
import { setLocalStorageItem } from "../../../helper/localstorage"
import { setBranches } from "../../../../slices/companyBranchSlice.js"
import UseFetch from "../../../hooks/useFetch"
const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const navigate = useNavigate()
  const { data: branches } = UseFetch("/branch/getBranch")

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await api.post(`/auth/login`, data)
      const datas = await response.data
      const { token, User } = datas
      if (response.status === 200) {
        setLocalStorageItem("authToken", token)
        setLocalStorageItem("user", User)
        const allcompanybranches = branches.map((b) => b._id)
        // Store in localStorage
        setLocalStorageItem("companybranches", allcompanybranches)
        dispatch(setBranches(allcompanybranches)) //companies all branches
        setTimeout(() => {
          if (User.role === "Admin") {
            setLoading(false)
            navigate("/admin/dashBoard")
          } else if (User.role === "Staff" || User.role === "Manager") {
            setLoading(false)
            navigate("/staff/dashBoard")
          }
        }, 1000)
        toast.success(response.data.message, {
          icon: "🚀",
          style: {
            backgroundColor: "#fff", // White background
            color: "#000", // Black text for better contrast
            boxShadow:
              "0px 4px 10px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.1)", // 3D shadow effect
            borderRadius: "8px", // Rounded corners for a polished look
            padding: "10px 15px", // Comfortable padding
            fontWeight: "bold" // Bold text for prominence
          }
        })
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error("something went wrong")
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      )
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className=" w-[350px] md:w-[400px] p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="emailOrMobile"
              className="block text-sm font-medium text-gray-700"
            >
              Email or Mobile
            </label>
            <input
              type="text"
              id="emailOrMobile"
              {...register("emailOrMobile", {
                required: "Email or mobile number is required",
                validate: (value) => {
                  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                  const isValidMobile = /^[0-9]{10}$/.test(value)
                  if (!isValidEmail && !isValidMobile) {
                    return "Invalid email or mobile number"
                  }
                }
              })}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoComplete="off"
            />
            {errors.emailOrMobile && (
              <p className="mt-2 text-sm text-red-600">
                {errors.emailOrMobile.message}
              </p>
            )}
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                {...register("password", { required: "Password is required" })}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </span>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center  px-4 py-2 font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {/* {loading ? "Loading..." : "Login"} */}
            {loading ? (
              <FaSpinner className="animate-spin h-5 w-5  text-white " />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import api from "../../../api/api"
// import { useNavigate } from "react-router-dom"
// import { useDispatch } from "react-redux"
// import { FaSpinner } from "react-icons/fa"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
// import { toast } from "react-toastify"
// import { setLocalStorageItem } from "../../../helper/localstorage"
// import { setBranches } from "../../../../slices/companyBranchSlice.js"
// import UseFetch from "../../../hooks/useFetch"

// const Login = () => {
//   const [passwordVisible, setPasswordVisible] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const dispatch = useDispatch()
//   const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm()
//   const navigate = useNavigate()
//   const { data: branches } = UseFetch("/branch/getBranch")
//   const onSubmit = async (data) => {
//     try {
//       setLoading(true)
//       const response = await api.post(`/auth/login`, data)
//       const datas = response.data
//       const { token, User } = datas
//       if (response.status === 200) {
//         toast.success(response.data.message, {
//           icon: "🚀",
//           style: {
//             backgroundColor: "#fff",
//             color: "#000",
//             boxShadow:
//               "0px 4px 10px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.1)",
//             borderRadius: "8px",
//             padding: "10px 15px",
//             fontWeight: "bold"
//           }
//         })
//         localStorage.setItem("authToken", token)
//         localStorage.setItem("user", JSON.stringify(User))
//         const allcompanybranches = branches.map((b) => b._id)
//         setLocalStorageItem("companybranches", allcompanybranches)
//         dispatch(setBranches(allcompanybranches))
//         setTimeout(() => {
//           if (User.role === "Admin") {
//             setLoading(false)
//             navigate("/admin/dashBoard")
//           } else if (User.role === "Staff" || User.role === "Manager") {
//             setLoading(false)
//             navigate("/staff/dashBoard")
//           }
//         }, 1000)
//       }
//     } catch (error) {
//       setLoading(false)
//       toast.error("invalid credentials")
//     }
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-centerbg-no-repeat bg-center bg-cover"
//       style={{ backgroundImage: "url('/crmnew.jpg')" }}
//     >
//       <div className="w-full max-w-xl flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Illustration */}
//         <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-tr from-indigo-100 to-blue-200 p-6">
//           <img src="/crmbackground.jpg" alt="Telecaller" className="w-36 mb-5" />
//           <blockquote className="text-md italic text-gray-700 text-center mb-2">
//             "Every successful conversation is built on listening, not just
//             talking."
//           </blockquote>
//           <span className="text-xs text-indigo-500 font-semibold text-center">
//             Empowering Connections, Building Trust
//           </span>
//         </div>
//         {/* Login Form Card */}
//         <div className="w-full md:w-1/2 p-8 bg-white">
//           <h2 className="text-2xl font-extrabold mb-2 text-center text-indigo-700">
//             CRM Portal Login
//           </h2>
//           <p className="mb-6 text-xs text-center text-gray-500">
//             Telecaller Access
//           </p>
//           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
//             <div className="mb-5">
//               <label
//                 htmlFor="emailOrMobile"
//                 className="block text-sm font-semibold text-gray-700"
//               >
//                 Email or Mobile
//               </label>
//               <input
//                 type="text"
//                 id="emailOrMobile"
//                 {...register("emailOrMobile", {
//                   required: "Email or mobile number is required",
//                   validate: (value) => {
//                     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
//                       value
//                     )
//                     const isValidMobile = /^[0-9]{10}$/.test(value)
//                     if (!isValidEmail && !isValidMobile) {
//                       return "Invalid email or mobile number"
//                     }
//                   }
//                 })}
//                 className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
//                   errors.emailOrMobile ? "border-red-400" : "border-gray-200"
//                 }`}
//               />
//               {errors.emailOrMobile && (
//                 <p className="mt-1 text-xs text-red-600">
//                   {errors.emailOrMobile.message}
//                 </p>
//               )}
//             </div>
//             <div className="mb-5 relative">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-semibold text-gray-700"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={passwordVisible ? "text" : "password"}
//                   id="password"
//                   {...register("password", {
//                     required: "Password is required"
//                   })}
//                   className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10 transition ${
//                     errors.password ? "border-red-400" : "border-gray-200"
//                   }`}
//                   autoComplete="off"
//                 />
//                 <span
//                   className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-gray-400 hover:text-indigo-600"
//                   onClick={() => setPasswordVisible(!passwordVisible)}
//                 >
//                   <FontAwesomeIcon
//                     icon={passwordVisible ? faEyeSlash : faEye}
//                   />
//                 </span>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-xs text-red-600">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full flex items-center justify-center px-4 py-2.5 font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//             >
//               {loading ? (
//                 <FaSpinner className="animate-spin h-5 w-5 text-white" />
//               ) : (
//                 "Login"
//               )}
//             </button>
//           </form>
//           <footer className="mt-7 text-xs text-gray-400 text-center">
//             © 2025 AcmeCRM —{" "}
//             <span className="italic font-medium text-indigo-500">
//               "Your success, our connection."
//             </span>
//           </footer>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login
