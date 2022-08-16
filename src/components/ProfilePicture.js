import React from "react"
import DefaultProfilePicture from "../images/default_profile_picture.jpg"

const ProfilePicture = ({ pictureUrl, width }) => {
  return (
    <img
      style={{ borderRadius: "50%", width: `${width}px` }}
      src={pictureUrl ?? DefaultProfilePicture}
      alt="profile"
    />
  )
}

export default ProfilePicture
