import React from "react"
import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import useAxios from "../hooks/use-axios"
import classes from "./PendingUser.module.css"
import ProfilePicture from "./ProfilePicture"
import { useSelector } from "react-redux"
import Spinner from "react-bootstrap/Spinner"

const PendingUser = ({
  user,
  onProfileClick,
  onFollowerAccept,
  onPendingFollowerRemove,
}) => {
  const token = useSelector((state) => state.auth.token)
  const profileLinkClickHandler = () => {
    onProfileClick()
  }

  const { isLoading: accepting, sendRequest: acceptFollower } = useAxios()
  const { isLoading: removing, sendRequest: removeFollower } = useAxios()

  const acceptFollowerHandler = async () => {
    try {
      ;(async () => {
        const response = await acceptFollower({
          url: `/users/followers/${user.id}`,
          method: "POST",
          token,
        })
        if (!response.status) return
        onFollowerAccept(user.id)
      })()
    } catch {}
  }

  const removeFollowerHandler = async () => {
    try {
      ;(async () => {
        const response = await removeFollower({
          url: `/users/${user.id}/follow`,
          method: "DELETE",
          token,
        })
        if (!response.status) return
        onPendingFollowerRemove(user.id)
      })()
    } catch {}
  }

  return (
    <>
      <div className={`d-flex ${classes.content}`}>
        <div>
          <Link
            to={`/profile/${user.id}`}
            onClick={profileLinkClickHandler}
            style={{ color: "black", textDecoration: "none" }}
          >
            <ProfilePicture pictureURL={user.pictureURL} width={60} />{" "}
          </Link>
        </div>
        <div className={classes.innerContent}>
          <div
            style={{
              marginLeft: "25px",
            }}
          >
            <Link
              to={`/profile/${user.id}`}
              onClick={profileLinkClickHandler}
              style={{ color: "black", textDecoration: "none" }}
            >
              <p className={classes.fullName}>
                {user.firstName} {user.lastName}
              </p>
              <p className={classes.username}>username: {user.username}</p>{" "}
            </Link>
          </div>
          <div className="align-self-center">
            <Button
              variant="primary"
              className={classes.actionButton}
              onClick={acceptFollowerHandler}
            >
              Accept
            </Button>
            {accepting && (
              <Spinner animation="border" role="status" size="sm" />
            )}
            <Button
              variant="danger"
              className={classes.actionButton}
              onClick={removeFollowerHandler}
            >
              Remove
            </Button>
            {removing && <Spinner animation="border" role="status" size="sm" />}
          </div>
        </div>
      </div>
    </>
  )
}

export default PendingUser
