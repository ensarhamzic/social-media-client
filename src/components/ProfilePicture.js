import React from "react"
import DefaultProfilePicture from "../images/default_profile_picture.jpg"

const ProfilePicture = ({ pictureURL, width }) => {
  return (
    <img
      style={{ borderRadius: "50%", width: `${width}px` }}
      src={pictureURL ?? DefaultProfilePicture}
      alt="profile"
    />
  )
}

export default ProfilePicture
