// import { useEffect, useState } from "react"
// import { fetchDataFromApi } from "../api/fetchDataFromApi"

// const UseFetch = (url) => {
//   console.log(url)
//   console.log("usefethchhhhhhhh")
//   const [refresh, setRefresh] = useState(false)
//   const [data, setData] = useState(null)
//   const [fulldateholiday, setfulldateHoliday] = useState(null)
//   const [loading, setLoading] = useState(false)
//   console.log(loading)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     console.log(url)
//     if (!url) {
//       return
//     }

//     const fetchData = async () => {
//       setLoading(true)
//       setData(null)
//       setError(null)

//       try {
//         console.log("hhhhh")
//         const result = await fetchDataFromApi(url)
//         if (url === "/branch/getBranch") {
//           console.log(result)
//         }
//         console.log(result)
//         if (result) {
//           console.log(result)
//           setData(result.data)
//           if (url === "/branch/getBranch") {
//             console.log(result.data)
//           }
//           setLoading(false)
//         } else {
//           setError("Expected data to be an array")
//           console.error("Error", result)
//         }
//       } catch (err) {
//         setLoading(false)
//         setError(err.message || "Something went wrong!")
//       }
//     }

//     fetchData()
//   }, [url, refresh])

//   const refreshHook = () => {
//     setRefresh(!refresh)
//   }
//   console.log(loading)
//   return { data, loading, error, refreshHook, fulldateholiday }
// }

// export default UseFetch



import { useEffect, useState } from "react"
import { fetchDataFromApi } from "../api/fetchDataFromApi"

const UseFetch = (url) => {
  const [refresh, setRefresh] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await fetchDataFromApi(url)

        // if fetchDataFromApi is axios-style, result.data is the full JSON body
        setData(result.data)
      } catch (err) {
        setError(err.message || "Something went wrong!")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, refresh])

  const refreshHook = () => {
    setRefresh((prev) => !prev)
  }

  return { data, loading, error, refreshHook }
}

export default UseFetch
