import React from "react"
import { Link } from "react-router-dom"
import ProfilePicture from "./ProfilePicture"

const Comment = ({ id, text, user }) => {
  return (
    <div className="d-flex mt-3">
      <div>
        <ProfilePicture pictureUrl={user.pictureUrl} width={50} />
      </div>
      <div style={{ marginLeft: "15px", width: "70%" }}>
        <Link to={`/profile/${user.id}`}>
          <p style={{ margin: "0" }} className="fw-bold">
            {user.username}
          </p>
        </Link>
        <p style={{ margin: "0" }}>{text}</p>
      </div>
    </div>
  )
}

export default Comment
