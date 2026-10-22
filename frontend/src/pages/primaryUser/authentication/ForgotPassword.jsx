import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FaSpinner } from "react-icons/fa"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import api from "../../../api/api"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email }) => {
    if (submitting) return
    try {
      setSubmitting(true)
      await api.post("/auth/forgot-password", { email })
      setSubmitted(true)
    } catch (error) {
      toast.error("We could not process your request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-6">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-900/10 sm:p-10">
        <button type="button" onClick={() => navigate("/login")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to sign in
        </button>
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter your work email and we’ll send a six-digit code to reset your password.
        </p>

        {submitted ? (
          <div className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
            If an account matches that email address, a six-digit code has been sent. Check your inbox and spam folder.
            <button type="button" onClick={() => navigate("/reset-password")} className="mt-4 block font-semibold text-emerald-900 underline">Enter reset code</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Work email</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="email" type="email" autoComplete="email" placeholder="name@company.com" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70">
              {submitting ? <FaSpinner className="h-5 w-5 animate-spin" /> : <><span>Send reset code</span><FontAwesomeIcon icon={faPaperPlane} className="text-sm" /></>}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

export default ForgotPassword
