import React, { useState } from "react"
import DefaultProfilePicture from "../images/default_profile_picture.jpg"

const ProfilePicture = ({ pictureURL, width }) => {
  const [imageError, setImageError] = useState(false)

  const imageLoadingErrorHandler = () => {
    setImageError(true)
  }

  let imageSrc = DefaultProfilePicture
  if (!imageError && pictureURL) {
    imageSrc = pictureURL
  }
  return (
    <img
      style={{ borderRadius: "50%", width: `${width}px`, height: `${width}px` }}
      src={imageSrc}
      onError={imageLoadingErrorHandler}
      alt="profile"
    />
  )
}

export default ProfilePicture
