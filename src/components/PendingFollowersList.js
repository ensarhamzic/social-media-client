import React from "react"
import PendingUser from "./PendingUser"

const PendingFollowersList = ({
  users,
  onProfileClick,
  onFollowerAccept,
  onPendingFollowerRemove,
}) => {
  const profileClickHandler = () => {
    if (onProfileClick) onProfileClick()
  }

  const followerAcceptHandler = (userId) => {
    onFollowerAccept(userId)
  }

  const followerRemoveHandler = (userId) => {
    onPendingFollowerRemove(userId)
  }

  return (
    <>
      {users.length > 0 &&
        users.map((u) => (
          <PendingUser
            key={u.id}
            user={u}
            onProfileClick={profileClickHandler}
            onFollowerAccept={followerAcceptHandler}
            onPendingFollowerRemove={followerRemoveHandler}
          />
        ))}
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

export default PendingFollowersList
