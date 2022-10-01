import React from "react"
import { Link } from "react-router-dom"
import ProfilePicture from "./ProfilePicture"
import classes from "./User.module.css"

const User = ({ user, onProfileClick, chatMode }) => {
  const profileLinkClickHandler = () => {
    onProfileClick(user)
  }

  const content = (
    <div
      className={`d-flex align-items-center ${classes.content}`}
      onClick={profileLinkClickHandler}
    >
      <div>
        <ProfilePicture pictureURL={user.pictureURL} width={60} />
      </div>
      <div
        style={{
          marginLeft: "25px",
        }}
      >
        <p className={classes.fullName}>
          {user.firstName} {user.lastName}
        </p>
        <p className={classes.username}>username: {user.username}</p>
      </div>
    </div>
  )

  if (chatMode) return content

  return (
    <Link
      to={`/profile/${user.id}`}
      style={{ color: "black", textDecoration: "none" }}
    >
      {content}
    </Link>
  )
}

export default User
