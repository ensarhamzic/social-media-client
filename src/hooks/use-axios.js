import { useState, useCallback } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

const useAxios = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendRequest = useCallback(
    async ({
      url,
      method,
      data,
      token,
      errorMessage,
      contentType = "application/json",
    }) => {
      setIsLoading(true)
      let axiosConfig = {
        url: `${API_URL}${url}`,
        method,
        headers: {
          "Content-Type": contentType,
        },
      }
      if (data) axiosConfig.data = data
      if (token)
        axiosConfig.headers = {
          ...axiosConfig.headers,
          Authorization: `Bearer ${token}`,
        }
      let response = null
      try {
        const serverResponse = await axios(axiosConfig)
        setError(null)
        response = serverResponse
      } catch (error) {
        setError(errorMessage ?? error.response.data.message)
      }
      setIsLoading(false)
      return response
    },
    []
  )

  return { isLoading, error, sendRequest }
}

export default useAxios
