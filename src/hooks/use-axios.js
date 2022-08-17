import { useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

const useAxios = () => {
  const token = useSelector((state) => state.auth.token)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendRequest = async ({ url, method, data, auth, errorMessage }) => {
    setIsLoading(true)
    let axiosConfig = {
      url: `${API_URL}${url}`,
      method,
    }
    if (data) axiosConfig.data = data
    if (auth)
      axiosConfig.headers = {
        Authorization: `Bearer ${token}`,
      }
    let response = null
    try {
      const serverResponse = await axios(axiosConfig)
      response = serverResponse
    } catch (error) {
      setError(errorMessage ?? error.response.data.message)
    }
    setIsLoading(false)
    return response
  }

  return { isLoading, error, sendRequest }
}

export default useAxios
