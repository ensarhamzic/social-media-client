import React from "react"
import User from "./User"

const UsersList = ({ users }) => {
  return (
    <>
      {users.length > 0 && users.map((u) => <User key={u.id} user={u} />)}
      {users.length === 0 && (
        <p
          style={{
            fontSize: "1.2rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          No users
        </p>
      )}
    </>
  )
}

export default UsersList
