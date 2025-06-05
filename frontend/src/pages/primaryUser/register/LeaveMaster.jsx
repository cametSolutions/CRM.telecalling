import  { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai"
import api from "../../../api/api"
import { FaSpinner } from "react-icons/fa"
import YearDropdown from "../../../components/common/YearDropDown"
import { toast } from "react-toastify"
import UseFetch from "../../../hooks/useFetch"

import TimeInput from "../../../components/common/TimeInput"

function LeaveMaster() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm()
  const [showShowHoliday, setShowHoliday] = useState(false)
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [year, setyear] = useState("")
  const [holy, setHoly] = useState({
    customTextInput: "",
    holyDate: ""
  })
  const [tableholy, setTableHoly] = useState([])
  const { data: leaveData, refreshHook } = UseFetch("/customer/getleavemaster")
  const { data: holydata, refreshHook: holyrefresh } = UseFetch(
    "/customer/getallholy"
  )
  useEffect(() => {
    if (holydata && holydata.length > 0 && year) {
      const filteredByYear = holydata.filter((item) => {
        const date = new Date(item.holyDate)
        return date.getFullYear() === year
      })
      setTableHoly((prevState) => {
        // If holydata is an array, spread it; otherwise, add it directly
        if (Array.isArray(filteredByYear)) {
          return [...prevState, ...filteredByYear] // Spread holydata if it's an array
        }
        return [...prevState, filteredByYear] // Append holydata if it's an object
      })
    }
  }, [holydata, year])
  useEffect(() => {
    if (leaveData) {
      if (leaveData && leaveData.length > 0) {
        setValue("checkInTimeHour", splitTimeHour(leaveData[0]?.checkIn))
        setValue("checkInTimeMinute", splitTimeMinute(leaveData[0]?.checkIn))
        setValue("checkInTimePeriod", splitTimePeriod(leaveData[0]?.checkIn))
        ///
        setValue("checkOutTimeHour", splitTimeHour(leaveData[0]?.checkOut))
        setValue("checkOutTimeMinute", splitTimeMinute(leaveData[0]?.checkOut))
        setValue("checkOutTimePeriod", splitTimePeriod(leaveData[0]?.checkOut))
        //
        setValue("checkInEndAtHour", splitTimeHour(leaveData[0]?.checkInEndAt))
        setValue(
          "checkInEndAtMinute",
          splitTimeMinute(leaveData[0]?.checkInEndAt)
        )
        setValue(
          "checkInEndAtPeriod",
          splitTimePeriod(leaveData[0]?.checkInEndAt)
        )
        //
        setValue(
          "checkOutStartAtHour",
          splitTimeHour(leaveData[0]?.checkOutStartAt)
        )
        setValue(
          "checkOutStartAtMinute",
          splitTimeMinute(leaveData[0]?.checkOutStartAt)
        )
        setValue(
          "checkOutStartAtPeriod",
          splitTimePeriod(leaveData[0]?.checkOutStartAt)
        )

        setValue("lateArrival", leaveData[0]?.lateArrival)
        setValue("privilegeleave", leaveData[0]?.privilegeleave)
        setValue("sickleave", leaveData[0]?.sickleave)
        setValue("casualleave", leaveData[0]?.casualleave)
        setValue("earlyOut", leaveData[0]?.earlyOut)
        setValue("deductsalaryMinute", leaveData[0]?.deductSalaryMinute)
      }
    }
  }, [holydata, leaveData])
  const splitTimeHour = (timeString) => {
    // Split the string into time and period parts
    const [time, period] = timeString.split(" ")

    // Split the time into hours and minutes
    const [hour, minute] = time.split(":")

    // Return the values as an object

    return parseInt(hour, 10) // Convert hour to number
  }
  const splitTimeMinute = (timeString) => {
    // Split the string into time and period parts
    const [time, period] = timeString.split(" ")

    // Split the time into hours and minutes
    const [hour, minute] = time.split(":")

    // Return the values as an object
    return minute // Convert minute to number
  }
  const splitTimePeriod = (timeString) => {
    // Split the string into time and period parts
    const [time, period] = timeString.split(" ")

    // Return the values as an object
    return period // Return AM or PM
  }

  // Generate an array of years (e.g., 2020 to 2030)
  const years = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() + i
  )

  const handleEditHoly = (name) => {
    const holyToEdit = tableholy.find((item) => item.customTextInput === name)
    if (holyToEdit) {
      setValue("customTextInput", holyToEdit.customTextInput)
      setValue("holyDate", formatDateString(holyToEdit.holyDate))
    }
  }
  const handlenewHoly = (name) => {
    const holyToaddHolly = tableholy.find(
      (item) => item.customTextInput === name
    )
    if (holyToaddHolly) {
      setValue("customTextInput", holyToaddHolly.customTextInput)
      setValue("holyDate", formatDateString(holyToaddHolly.holyDate))
    }
  }
  const formatDateString = (dateString) => {
    const dateObject = new Date(dateString)
    const year = dateObject.getUTCFullYear()
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0") // Months are zero-indexed
    const day = String(dateObject.getUTCDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  const handleYear = (year) => {
    const yearNumber = Number(year)
    setyear(yearNumber)
    setTableHoly([])
  }
  // Handle form submission
  const onSubmit = async (data) => {
    if (data) {
      setLoading(true)

      const formattedData = {
        // Fields with hour, minute, and period
        checkIn: `${data.checkInTimeHour}:${data.checkInTimeMinute} ${data.checkInTimePeriod}`,
        checkOut: `${data.checkOutTimeHour}:${data.checkOutTimeMinute} ${data.checkOutTimePeriod}`,
        checkInEndAt: `${data.checkInEndAtHour}:${data.checkInEndAtMinute} ${data.checkInEndAtPeriod}`,
        checkOutStartAt: `${data.checkOutStartAtHour}:${data.checkOutStartAtMinute} ${data.checkOutStartAtPeriod}`,

        // Plain fields
        lateArrival: data.lateArrival,
        privilegeleave: data.privilegeleave,
        casualleave: data.casualleave,
        sickleave: data.sickleave,
        earlyOut: data.earlyOut,
        deductSalaryMinute: data.deductsalaryMinute,
        holyDate: data.holyDate,
        customTextInput: data.customTextInput
      }

      try {
        const response = await api.post(
          `/customer/leavemasterRegistration?editstate=${edit}`,
          formattedData,
          {
            withCredentials: true
          }
        )
        if (response.status === 200) {
          toast.success(response.data.message)
          refreshHook()
          holyrefresh()
          setTableHoly([])
          setLoading(false)
          reset({ customTextInput: "", holyDate: "" })
        }
      } catch (error) {
        setHoly({
          customTextInput: "",
          holyDate: ""
        })
        refreshHook()
        holyrefresh()
        setTableHoly([])
        setLoading(false)
        console.log("error", error.message)
        toast.error(error.response.data.message)
      }
    }
  }

  return (
    <div className="p-8 ">
      <div className="px-7 text-center border shadow-lg rounded bg-white">
        <h1 className="text-2xl font-bold p-3">Leave Master</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="h-full py-2  ">
          <div className="flex justify-end ">
            <button
              type="button"
              className="bg-blue-700 rounded-md px-4 py-1 text-white hover:bg-blue-800"
              onClick={() => setShowHoliday(true)}
            >
              Holiday
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4  justify-items-center">
            <TimeInput
              label="Check-In-Time"
              name="checkInTime"
              register={register}
              errors={errors}
              watch={watch}
            />
            <TimeInput
              label="Check-Out-Time"
              name="checkOutTime"
              register={register}
              errors={errors}
              watch={watch}
            />
            <TimeInput
              label="Check-In-End-At"
              name="checkInEndAt"
              register={register}
              errors={errors}
              watch={watch}
            />
            <TimeInput
              label="Check-Out-Start-At"
              name="checkOutStartAt"
              register={register}
              errors={errors}
              watch={watch}
            />
            {/* Late Arrival */}
            <div>
              <label
                htmlFor="lateArrival"
                className="block text-sm font-medium text-gray-700"
              >
                Late Arrival After (minutes)
              </label>
              <input
                id="lateArrival"
                type="number"
                {...register("lateArrival", {
                  required: "Late Arrival is required"
                })}
                className="mt-1 py-1 border rounded w-auto px-5"
              />
              {errors.lateArrival && (
                <span className="text-red-500 text-sm">
                  {errors.lateArrival.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Privilege Leave
              </label>
              <input
                type="number"
                {...register("privilegeleave")}
                // value={User && User.joiningdate}
                className="mt-1 py-1 border border-gray-400 rounded w-56 px-2 focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.privilegeleave && (
                <span className="text-red-500 text-sm">
                  {errors.privilegeleave.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Casual Leave
              </label>
              <input
                type="number"
                {...register("casualleave")}
                // value={User && User.joiningdate}
                className="mt-1 py-1 border  border-gray-300 rounded w-56 px-2 focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.casualleave && (
                <span className="text-red-500 text-sm">
                  {errors.casualleave.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sick Leave
              </label>
              <input
                type="number"
                {...register("sickleave")}
                // value={User && User.joiningdate}
                className="mt-1 py-1 border border-gray-300 rounded w-56 px-2 focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.sickleave && (
                <span className="text-red-500 text-sm">
                  {errors.sickleave.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor=" deductSalaryMinute"
                className="block text-sm font-medium text-gray-700"
              >
                Deduct salary if staff is late or early
                <br />
                by more than
              </label>
              <input
                id="deductsalaryMinute"
                type="number"
                {...register("deductsalaryMinute", {
                  required: "Late Arrival is required"
                })}
                className="mt-1 py-1 border border-gray-300 rounded w-56 px-2 focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.deductsalaryMinute && (
                <span className="text-red-500 text-sm">
                  {errors.deductsalaryMinute.message}
                </span>
              )}
            </div>
          </div>
          {showShowHoliday && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="relative bg-white p-6 rounded-lg shadow-lg w-full h-96 mx-4 sm:w-3/4 md:w-2/3 lg:w-1/2">
                {/* Close Icon */}
                <button
                  onClick={() => {
                    setyear("")
                    setShowHoliday(false)
                    setHoly({
                      customTextInput: "",
                      holyDate: ""
                    })
                    setEdit(false)
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="flex space-x-6 h-full">
                  {/* Scrollable Holidays Section */}
                  <div className="w-2/5 border-r border-gray-300 ">
                    <div className="h-full overflow-y-auto space-y-2">
                      {tableholy && tableholy.length > 0 ? (
                        tableholy.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 w-full pr-2"
                          >
                            {/* Add an icon if needed */}
                            <AiOutlinePlus
                              className="text-blue-700 w-5 h-5"
                              onClick={() => {
                                setEdit(false)
                                handlenewHoly(item.customTextInput)
                              }}
                            />
                            <span className="block text-gray-700 bg-blue-100 border border-gray-400 px-3 py-1 rounded-md w-full">
                              {item.customTextInput}
                            </span>
                            <AiOutlineEdit
                              className="text-blue-700 w-5 h-5"
                              onClick={() => {
                                setEdit(!false)
                                handleEditHoly(item.customTextInput)
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-center mt-2">
                          No Holy Day registered
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="w-3/5 space-y-6">
                    <YearDropdown handleyear={handleYear} />
                    {/* Holiday Input */}
                    <div>
                      <label
                        htmlFor="customTextInput"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Holiday
                      </label>
                      <input
                        id="customTextInput"
                        type="text"
                        {...register("customTextInput")}
                        onChange={(e) =>
                          setHoly({
                            ...holy,
                            customTextInput: e.target.value.trim()
                          })
                        }
                        // value={holy.customTextInput}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {errors.customTextInput && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors.customTextInput.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="holyDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Select Date
                      </label>
                      <input
                        id="holyDate"
                        type="date"
                        {...register("holyDate")}
                        onChange={(e) =>
                          setHoly({
                            ...holy,
                            holyDate: e.target.value.trim()
                          })
                        }
                        // value={holy.holyDate}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {errors.holyDate && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors.holyDate.message}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="bg-green-600 text-white px-5 py-1.5 rounded hover:bg-green-700"
                    >
                      {loading ? (
                        <FaSpinner className="animate-spin" /> // Display spinner when loading
                      ) : (
                        <span>{edit ? "UPDATE" : "ADD"}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!showShowHoliday && (
            <div className="flex justify-center mt-40 mb-8">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" /> // Display spinner when loading
                ) : (
                  <span>{edit ? "UPDATE" : "SUBMIT"}</span>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default LeaveMaster
