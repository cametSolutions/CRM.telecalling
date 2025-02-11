import React from "react"

const TimeInput = ({ label, name, register, errors, watch }) => {
  const hour = watch(`${name}Hour`)
  const minute = watch(`${name}Minute`)
  const period = watch(`${name}Period`)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-3 ">
        {/* Hour */}
        <select
          {...register(`${name}Hour`, {
            required: `${label} Hour is required`
          })}
          className="border border-gray-300 rounded-md shadow-sm px-3 py-1"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        {/* Minute */}
        <select
          {...register(`${name}Minute`, {
            required: `${label} Minute is required`
          })}
          className="border border-gray-300 rounded-md shadow-sm px-3 py-1"
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i < 10 ? `0${i}` : i}>
              {i < 10 ? `0${i}` : i}
            </option>
          ))}
        </select>

        {/* AM/PM */}
        <select
          {...register(`${name}Period`, {
            required: `${label} Period is required`
          })}
          className="border border-gray-300 rounded-md shadow-sm px-3 py-1"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>

      {/* Errors */}
      {(errors[`${name}Hour`] ||
        errors[`${name}Minute`] ||
        errors[`${name}Period`]) && (
        <span className="text-red-500 text-sm">
          {errors[`${name}Hour`]?.message ||
            errors[`${name}Minute`]?.message ||
            errors[`${name}Period`]?.message}
        </span>
      )}
    </div>
  )
}

export default TimeInput
