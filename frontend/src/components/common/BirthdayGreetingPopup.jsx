import { useEffect, useMemo, useState } from "react"
import { Cake, X } from "lucide-react"
import UseFetch from "../../hooks/useFetch"
import { getLocalStorageItem } from "../../helper/localstorage"

const getTodayKey = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
}

export default function BirthdayGreetingPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [birthdayPeople, setBirthdayPeople] = useState([])
  const { data: birthdays } = UseFetch("/auth/getallcurrentmonthBirthdays")
  const userId = getLocalStorageItem("user")?._id || "guest"
  const dismissalKey = useMemo(
    () => `birthday-greeting:${userId}:${getTodayKey()}`,
    [userId]
  )

  useEffect(() => {
    if (!Array.isArray(birthdays) || localStorage.getItem(dismissalKey)) return

    const today = new Date()
    const monthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    const people = birthdays.filter((person) => String(person?.dateofbirth || "").slice(5, 10) === monthDay)

    if (people.length) {
      setBirthdayPeople(people)
      setIsOpen(true)
    }
  }, [birthdays, dismissalKey])

  const close = () => {
    localStorage.setItem(dismissalKey, "true")
    setIsOpen(false)
  }

  if (!isOpen) return null

  return <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Birthday greeting">
    <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-pink-200 bg-white p-6 text-center shadow-2xl">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-pink-500 via-violet-500 to-amber-400" />
      <button type="button" onClick={close} aria-label="Close birthday greeting" className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
      <span className="mx-auto mt-3 grid h-16 w-16 place-items-center rounded-full bg-pink-50 text-pink-600"><Cake size={32} /></span>
      <h2 className="mt-4 text-2xl font-extrabold text-pink-700">Happy Birthday!</h2>
      <p className="mt-2 text-sm text-slate-600">Wishing {birthdayPeople.map((person) => person?.name).filter(Boolean).join(", ")} a wonderful year ahead.</p>
      <button type="button" onClick={close} className="mt-6 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">Thanks!</button>
    </section>
  </div>
}
