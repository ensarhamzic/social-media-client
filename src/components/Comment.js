import React from "react"
import { Link } from "react-router-dom"
import ProfilePicture from "./ProfilePicture"
import Button from "react-bootstrap/Button"
import { useSelector } from "react-redux"
import classes from "./Comment.module.css"

const Comment = ({ id, text, postUserId, user, onCommentDelete }) => {
  const authUserId = useSelector((state) => state.auth.user.id)

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
        <div className="d-flex justify-content-between">
          <Link
            to={`/profile/${user.id}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            <p style={{ margin: "0" }} className="fw-bold">
              {user.username}
            </p>
          </Link>
          {(user.id === authUserId || postUserId === authUserId) && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={deleteCommentHandler}
            >
              Delete
            </Button>
          )}
        </div>

        <p style={{ margin: "0" }}>{text}</p>
      </div>
    </div>
  )
}

export default Comment
