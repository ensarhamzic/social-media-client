import React from "react"
import { Link } from "react-router-dom"
import ProfilePicture from "./ProfilePicture"
import classes from "./User.module.css"

const User = ({ user, onProfileClick }) => {
  const profileLinkClickHandler = () => {
    onProfileClick()
  }
  return (
    <Link
      to={`/profile/${user.id}`}
      onClick={profileLinkClickHandler}
      style={{ color: "black", textDecoration: "none" }}
    >
      <div className={`d-flex ${classes.content}`}>
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
    </Link>
  )
}

export default User
