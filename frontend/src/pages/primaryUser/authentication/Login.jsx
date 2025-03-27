import React, { useState } from "react"
import { useForm } from "react-hook-form"
import api from "../../../api/api"
import { useNavigate, Link } from "react-router-dom"
import { FaSpinner } from "react-icons/fa"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await api.post(`/auth/login`, data)
      const datas = await response.data
      const { token, User, role } = datas
      if (response.status === 200) {
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
        localStorage.setItem("authToken", token)
        localStorage.setItem("user", JSON.stringify(User))

        setTimeout(() => {
          if (User.role === "Admin") {
            setLoading(false)
            navigate("/admin/home")
          } else if (User.role === "Staff") {
            setLoading(false)
            navigate("/staff/home")
          }
        }, 1000)
      }
    } catch (error) {
      setLoading(false)
      toast.error("invalid credentials")
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
        {/* <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-500">
            Register
          </Link>
        </p> */}
      </div>
    </div>
  )
}

export default Login
