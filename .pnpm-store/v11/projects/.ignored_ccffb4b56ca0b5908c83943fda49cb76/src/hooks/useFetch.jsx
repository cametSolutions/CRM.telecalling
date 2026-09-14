

import { useEffect, useState } from "react"
import { fetchDataFromApi } from "../api/fetchDataFromApi"

const UseFetch = (url) => {
  const [refresh, setRefresh] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(url))
console.log(loading)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    if (!url) {
      setLoading(false)
      setError(null)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await fetchDataFromApi(url)
        if (!active) return
        setData(result?.data ?? null)
      } catch (err) {
        if (!active) return
        setError(err?.message || "Something went wrong!")
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [url, refresh])

  const refreshHook = () => {
    setRefresh((prev) => !prev)
  }

  return { data, loading, error, refreshHook }
}

export default UseFetch