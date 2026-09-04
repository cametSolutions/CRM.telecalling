// // import { useEffect } from "react"
// // import { unstable_useBlocker as useBlocker } from "react-router-dom"

// // const useUnsavedChangesPrompt = (when, message) => {
// //   const blocker = useBlocker(when)

// //   useEffect(() => {
// //     if (blocker.state === "blocked") {
// //       const confirmLeave = window.confirm(message)
// //       if (confirmLeave) {
// //         blocker.proceed()
// //       } else {
// //         blocker.reset()
// //       }
// //     }
// //   }, [blocker, message])

// //   useEffect(() => {
// //     const handleBeforeUnload = (e) => {
// //       if (!when) return
// //       e.preventDefault()
// //       e.returnValue = ""
// //     }

// //     window.addEventListener("beforeunload", handleBeforeUnload)
// //     return () => window.removeEventListener("beforeunload", handleBeforeUnload)
// //   }, [when])
// // }

// // export default useUnsavedChangesPrompt

// // import { useEffect } from "react"

// // const useUnsavedChangesPrompt = (when) => {
// //   useEffect(() => {
// //     const handleBeforeUnload = (e) => {
// //       if (!when) return
// //       e.preventDefault()
// //       e.returnValue = ""
// //     }

// //     window.addEventListener("beforeunload", handleBeforeUnload)
// //     return () => window.removeEventListener("beforeunload", handleBeforeUnload)
// //   }, [when])
// // }

// // export default useUnsavedChangesPrompt
// import { useEffect, useRef } from "react"

// const useUnsavedChangesPrompt = (when, message) => {
//   const isPromptingRef = useRef(false)

//   useEffect(() => {
//     if (!when) return

//     const handleBeforeUnload = (e) => {
//       e.preventDefault()
//       e.returnValue = ""
//     }

//     const handlePopState = () => {
//       if (isPromptingRef.current) return
//       if (!when) return

//       isPromptingRef.current = true

//       const confirmLeave = window.confirm(message)

//       if (confirmLeave) {
//         window.removeEventListener("popstate", handlePopState)
//         window.history.back()
//       } else {
//         window.history.pushState(null, "", window.location.href)
//       }

//       isPromptingRef.current = false
//     }

//     window.history.pushState(null, "", window.location.href)
//     window.addEventListener("beforeunload", handleBeforeUnload)
//     window.addEventListener("popstate", handlePopState)

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload)
//       window.removeEventListener("popstate", handlePopState)
//     }
//   }, [when, message])
// }


// export default useUnsavedChangesPrompt
import { useEffect, useRef } from "react"

const useUnsavedChangesPrompt = ({
  when,
  onBlock
}) => {
  const isBlockingRef = useRef(false)

  useEffect(() => {
    if (!when) return

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ""
    }

    const handlePopState = () => {
      if (isBlockingRef.current) return
      if (!when) return

      isBlockingRef.current = true
      onBlock?.({
        type: "browser-back",
        proceed: () => {
          window.removeEventListener("popstate", handlePopState)
          window.history.back()
        },
        stay: () => {
          window.history.pushState(null, "", window.location.href)
        }
      })
      isBlockingRef.current = false
    }

    window.history.pushState(null, "", window.location.href)
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [when, onBlock])
}

export default useUnsavedChangesPrompt