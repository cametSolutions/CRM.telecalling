import { useState } from "react"
import { useForm } from "react-hook-form"
import api from "../../../api/api"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaSpinner } from "react-icons/fa"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faEye,
  faEyeSlash,
  faLock,
  faUser
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"
import { setLocalStorageItem } from "../../../helper/localstorage"
import { loginSuccess } from "../../../../slices/authSlice.js"
import {
  setBranches,
  loggeduserBranches,
  setloggeduserBranchOptions,
  setsliceselectedBranch,
  selectedCompany as setSelectedCompany
} from "../../../../slices/companyBranchSlice.js"
const Login = () => {
  console.log("hhhh")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const navigate = useNavigate()
  console.log("hhhhh")
  const onSubmit = async (data) => {
    console.log("hhh")
    if (loading) return
    try {
      setLoading(true)
      const response = await api.post(`/auth/login`, data)
      const datas = response.data
      const { token, User, passwordExpiryWarning, leavemasterdata } = datas
      console.log(leavemasterdata)

      if (response.status === 200) {
        const selectedCompany = User.selected[0]
        // Persist the token before the first protected request. On hosted
        // deployments this also provides the Authorization-header fallback
        // when a browser has not yet returned the auth cookie.
        localStorage.setItem("authToken", token)
        const res = await api.get("/branch/getBranch")
        if (res.status === 200) {
          const allcompanybranches = res.data?.data?.map((b) => b._id) || []
          const loggeduserbranches = User.selected?.map((a) => a.branch_id)
          localStorage.setItem("user", JSON.stringify(User))
          const uniqueBranches = (User.selected || []).map((branch) => ({
            id: branch.branch_id,
            label: branch.branchName
          }))
          console.log(leavemasterdata[0]?.checkIn)
          // Save to localStorage
          setLocalStorageItem("selectedCompany", selectedCompany)
          setLocalStorageItem("selectedBranch", selectedCompany.branch_id)
          setLocalStorageItem("loggeduserbranches", loggeduserbranches)
          setLocalStorageItem("companybranches", allcompanybranches)
          setLocalStorageItem("loggeduserBranchOptions", uniqueBranches)
          setLocalStorageItem("checkinTime", leavemasterdata[0]?.checkIn)

          dispatch(setSelectedCompany(selectedCompany))
          dispatch(setsliceselectedBranch(selectedCompany.branch_id))
          dispatch(loggeduserBranches(loggeduserbranches))
          dispatch(setBranches(allcompanybranches))
          dispatch(setloggeduserBranchOptions(uniqueBranches))
          dispatch(
            loginSuccess({
              token,
              user: User,
              activeCompany: {
                company_id: selectedCompany.company_id,
                branch_id: selectedCompany.branch_id
              },
              checkInTime: leavemasterdata[0]?.checkIn
            })
          )

          console.log("hh")
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
          if (passwordExpiryWarning) {
            toast.warn(passwordExpiryWarning)
          }

          const dashboardBase = User.role === "Admin" ? "/admin" : "/staff"

          switch (User.department?.code) {
            case "DEPARTMENT1":
            case "DEPARTMENT2":
              navigate(`${dashboardBase}/dashboard`)
              break

            case "DEPARTMENT3":
              navigate(`${dashboardBase}/reports/markettingdashboard`)
              break
            case "DEPARTMENT4":
              navigate(`${dashboardBase}/support&department`)
              break
            case "DEPARTMENT5":
              navigate(`${dashboardBase}/reports/researchandDevelopment`)
              break

            default:
              navigate(`${dashboardBase}/dashboard`)
          }
        }
      }
    } catch (error) {
      console.log(error)
      const expired = error?.response?.data?.passwordExpired
      console.log(expired)
      const message = error?.response?.data?.message || "Something went wrong"
      console.log(error?.response?.data)
      if (expired) {
        toast.error(message)
        // Store minimal required data for password change flow
        localStorage.setItem(
          "pendingPasswordReset",
          JSON.stringify({
            userId: error?.response?.data?.userId,
            role: error?.response?.data?.role,
            department: error?.response?.data?.department,
            expired: true
          })
        )
        // Option 1: redirect to a dedicated reset/change password page
        navigate("/change-password", {
          state: {
            userId: error?.response?.data?.userId,
            role: error?.response?.data?.role,
            department: error?.response?.data?.department,
            expired: true
          }
        })

        return
      }
      setLoading(false)
      toast.error("something went wrong")
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      )
    }
  }

  return (
    <main className="h-dvh overflow-hidden bg-slate-100 p-0 sm:p-4 lg:p-6">
      <section className="mx-auto flex h-full max-w-6xl overflow-hidden bg-white shadow-2xl shadow-slate-900/10 sm:rounded-3xl">
        <div
          className="relative hidden w-[55%] overflow-hidden bg-slate-900 bg-cover bg-center lg:block"
          style={{ backgroundImage: "url('/background.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-indigo-950/80 to-blue-700/65" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-12 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold backdrop-blur">
                C
              </div>
              <p className="mt-12 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
                CRM Workspace
              </p>
              <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight">
                Keep every customer relationship moving forward.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
                Manage leads, teams, and customer activity from one secure,
                focused workspace.
              </p>
            </div>

            <div className="border-t border-white/20 pt-6 text-sm text-slate-200">
              Secure access for your team
            </div>
          </div>
        </div>

        <div className="flex min-h-0 w-full items-center justify-center bg-white px-6 py-6 sm:px-12 sm:py-8 lg:w-[45%] lg:px-14">
          <div className="w-full max-w-sm">
            <div className="mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-200 lg:hidden">
                C
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Welcome back
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Sign in to your account
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your details to continue to your CRM workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  htmlFor="emailOrMobile"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email or mobile number
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    id="emailOrMobile"
                    placeholder="name@company.com or 9876543210"
                    {...register("emailOrMobile", {
                      required: "Email or mobile number is required",
                      validate: (value) => {
                        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        const isValidMobile = /^[0-9]{10}$/.test(value)
                        if (!isValidEmail && !isValidMobile) {
                          return "Enter a valid email address or 10-digit mobile number"
                        }
                      }
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    autoComplete="username"
                  />
                </div>
                {errors.emailOrMobile && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.emailOrMobile.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    {...register("password", { required: "Password is required" })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-indigo-600 focus:outline-none"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <FaSpinner className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-400">
              Protected workspace · Authorized users only
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login
