import React from "react"
import { Link } from "react-router-dom"
import ProfilePicture from "./ProfilePicture"
import { useSelector } from "react-redux"
import classes from "./Comment.module.css"
import Dropdown from "react-bootstrap/Dropdown"

const Comment = ({ id, text, postUserId, user, onCommentDelete }) => {
  const authUser = useSelector((state) => state.auth.user)

  const deleteCommentHandler = () => {
    onCommentDelete(id)
  }
  return (
    <div className="d-flex mt-3">
      <div>
        <Link to={`/profile/${user.id}`}>
          <ProfilePicture pictureURL={user.pictureURL} width={50} />
        </Link>
      </div>
      <div className={classes.content}>
        <div className="d-flex align-items-baseline">
          <Link
            to={`/profile/${user.id}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            <p style={{ margin: "0" }} className="fw-bold">
              {user.username}
            </p>
          </Link>
          {(user.id === authUser.id ||
            postUserId === authUser.id ||
            authUser.role === "Admin") && (
            <Dropdown style={{ marginLeft: "10px" }}>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                style={{ color: "black" }}
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={deleteCommentHandler}>
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        <p style={{ margin: "0" }}>{text}</p>
      </div>
    </div>
  )
}

export default Comment
