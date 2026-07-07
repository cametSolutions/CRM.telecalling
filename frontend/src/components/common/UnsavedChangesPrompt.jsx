import { useEffect } from "react"
import { unstable_useBlocker as useBlocker } from "react-router-dom"

const useUnsavedChangesPrompt = (when, message) => {
  const blocker = useBlocker(when)

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm(message)
      if (confirmLeave) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker, message])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!when) return
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [when])
}

export default useUnsavedChangesPrompt