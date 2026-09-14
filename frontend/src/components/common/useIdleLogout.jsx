// import { useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const IDLE_TIME = 60 * 60 * 1000; // 1 hour

// export default function useIdleLogout() {
//   const navigate = useNavigate();
//   const timeoutRef = useRef();

//   const logout = () => {
//     localStorage.clear();
//     sessionStorage.clear();

//     // Optional: call logout API
//     // await axios.post("/auth/logout");

//     navigate("/", { replace: true });
//   };

//   const resetTimer = () => {
//     clearTimeout(timeoutRef.current);

//     timeoutRef.current = setTimeout(() => {
//       logout();
//     }, IDLE_TIME);
//   };

//   useEffect(() => {
//     const events = [
//       "mousemove",
//       "mousedown",
//       "click",
//       "scroll",
//       "keypress",
//       "touchstart",
//     ];

//     events.forEach((event) =>
//       window.addEventListener(event, resetTimer)
//     );

//     resetTimer();

//     return () => {
//       clearTimeout(timeoutRef.current);

//       events.forEach((event) =>
//         window.removeEventListener(event, resetTimer)
//       );
//     };
//   }, []);
// }
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import api from "../../api/api"
const IDLE_TIME = 60 * 60 * 1000 // 1 hour

export default function useIdleLogout() {
  const navigate = useNavigate()
  const timeoutRef = useRef()

  const logout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.error("Auto logout failed:", error)
    } finally {
      localStorage.clear()
      sessionStorage.clear()
      navigate("/", { replace: true })
    }
  }

  const resetTimer = () => {
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      logout()
    }, IDLE_TIME)
  }

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
      "touchstart"
    ]

    events.forEach((event) => window.addEventListener(event, resetTimer))

    resetTimer()

    return () => {
      clearTimeout(timeoutRef.current)

      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [])

  return null
}
