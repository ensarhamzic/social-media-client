import React, { useEffect, useState } from "react"
import Form from "react-bootstrap/Form"
import { useSelector } from "react-redux"
import useAxios from "../hooks/use-axios"
import UsersList from "./UsersList"

const SearchUsers = () => {
  const token = useSelector((state) => state.auth.token)
  const [users, setUsers] = useState([])
  const [searchString, setSearchString] = useState("")
  const { sendRequest: searchUsers } = useAxios()

  useEffect(() => {
    if (searchString.length >= 3 && token) {
      ;(async () => {
        const response = await searchUsers({
          url: `/users/search/${searchString}`,
          method: "GET",
          token,
        })
        setUsers(response.data)
      })()
    } else {
      setUsers([])
    }
  }, [searchString, token, searchUsers])

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Enter at least 3 characters to search"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />

      <UsersList users={users} />
    </div>
  )
}

export default SearchUsers
