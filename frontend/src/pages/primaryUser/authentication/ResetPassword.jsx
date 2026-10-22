import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FaSpinner } from "react-icons/fa"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faEye, faEyeSlash, faKey, faLock } from "@fortawesome/free-solid-svg-icons"
import api from "../../../api/api"

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,128}$/

const ResetPassword = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const newPassword = watch("newPassword", "")

  const onSubmit = async ({ email, otp, newPassword, confirmPassword }) => {
    if (submitting) return
    try {
      setSubmitting(true)
      const { data } = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
        confirmPassword
      })
      toast.success(data.message)
      navigate("/login", { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password. Request a new code.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-6">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-900/10 sm:p-10">
        <button type="button" onClick={() => navigate("/login")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"><FontAwesomeIcon icon={faArrowLeft} /> Back to sign in</button>
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><FontAwesomeIcon icon={faLock} /></div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Create a new password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Enter the six-digit code sent to your email, then choose a new password.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Work email</label>
            <input id="email" type="email" autoComplete="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-slate-700">Six-digit reset code</label>
            <div className="relative"><FontAwesomeIcon icon={faKey} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" {...register("otp", { required: "Reset code is required", pattern: { value: /^\d{6}$/, message: "Enter the six-digit code from your email" } })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 font-mono tracking-[0.35em] text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" /></div>
            {errors.otp && <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>}
          </div>
          {[{ id: "newPassword", label: "New password" }, { id: "confirmPassword", label: "Confirm new password" }].map(({ id, label }) => <div key={id}>
            <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
            <div className="relative"><FontAwesomeIcon icon={faLock} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id={id} type={visible ? "text" : "password"} autoComplete="new-password" {...register(id, id === "newPassword" ? { required: "Password is required", pattern: { value: passwordRule, message: "Use 10+ characters with uppercase, lowercase, and a number" } } : { required: "Please confirm your password", validate: (value) => value === newPassword || "Passwords do not match" })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" /><button type="button" onClick={() => setVisible((value) => !value)} className="absolute inset-y-0 right-0 px-4 text-slate-400 hover:text-indigo-600" aria-label={visible ? "Hide passwords" : "Show passwords"}><FontAwesomeIcon icon={visible ? faEyeSlash : faEye} /></button></div>
            {errors[id] && <p className="mt-2 text-sm text-red-600">{errors[id].message}</p>}
          </div>)}
          <button type="submit" disabled={submitting} className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">{submitting ? <FaSpinner className="h-5 w-5 animate-spin" /> : "Verify code and reset password"}</button>
        </form>
      </section>
    </main>
  )
}

export default ResetPassword
