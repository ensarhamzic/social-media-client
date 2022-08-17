import { useState, useCallback } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

const useAxios = () => {
  const token = useSelector((state) => state.auth.token)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendRequest = useCallback(
    async ({ url, method, data, auth, userToken, errorMessage }) => {
      setIsLoading(true)
      let axiosConfig = {
        url: `${API_URL}${url}`,
        method,
      }
      if (data) axiosConfig.data = data
      if (auth)
        axiosConfig.headers = {
          Authorization: `Bearer ${userToken ? userToken : token}`,
        }
      let response = null
      try {
        const serverResponse = await axios(axiosConfig)
        setError(null)
        console.log(url)
        response = serverResponse
      } catch (error) {
        setError(errorMessage ?? error.response.data.message)
      }
      setIsLoading(false)
      return response
    },
    [token]
  )

  return { isLoading, error, sendRequest }
}

export default useAxios
