

import { useEffect, useRef, useState } from "react"
import { fetchDataFromApi } from "../api/fetchDataFromApi"

const UseFetch = (url, { cacheTime = 0 } = {}) => {
  const [refresh, setRefresh] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState(null)
  const cacheRef = useRef(new Map())

  useEffect(() => {
    if (!url) {
      setLoading(false)
      setError(null)
      return
    }

    const cached = cacheRef.current.get(url)
    if (cached && cached.expiresAt > Date.now()) {
      setData(cached.data)
      setError(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await fetchDataFromApi(url, { signal: controller.signal })
        const nextData = result?.data ?? null

        if (cacheTime > 0) {
          cacheRef.current.set(url, {
            data: nextData,
            expiresAt: Date.now() + cacheTime
          })
        }

        setData(nextData)
      } catch (err) {
        if (err?.code === "ERR_CANCELED") return
        setError(err?.message || "Something went wrong!")
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [url, refresh, cacheTime])

  const refreshHook = () => {
    cacheRef.current.delete(url)
    setRefresh((prev) => prev + 1)
  }

  return { data, loading, error, refreshHook }
}

export default UseFetch
