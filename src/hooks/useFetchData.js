import axios from 'axios'
import { useState, useEffect } from 'react'

function useFetchData(apiUrl) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(apiUrl, { signal: controller.signal })
        if (!controller.signal.aborted) setData(response.data)
      } catch (err) {
        if (!controller.signal.aborted) setError(err)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    fetchData()
    return () => controller.abort()
  }, [apiUrl, retryCount])
  return {
    data,
    loading,
    error,
    retry: () => setRetryCount((count) => count + 1),
  }
}
export default useFetchData
