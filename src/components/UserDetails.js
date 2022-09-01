import React, { useState } from "react"
import Card from "react-bootstrap/Card"
import ProfilePicture from "./ProfilePicture"
import { useSelector } from "react-redux/es/exports"
import UsersList from "./UsersList"
import MainModal from "./MainModal"
import Button from "react-bootstrap/Button"
import useModal from "../hooks/use-modal"
import useAxios from "../hooks/use-axios"
import Spinner from "react-bootstrap/Spinner"
import { Link } from "react-router-dom"
import classes from "./UserDetails.module.css"
import PendingFollowersList from "./PendingFollowersList"

const UserDetails = ({
  user,
  onFollowUnfollow,
  onRemoveFollower,
  onFollowerAccept,
  onPendingFollowerRemove,
}) => {
  const { isLoading, sendRequest: followUnfollow } = useAxios()
  const { isLoading: isRemovingFollower, sendRequest: removeFollower } =
    useAxios()
  const [modalShowed, showModal, hideModal, title] = useModal()
  const [pendingModalShowed, showPendingModal, hidePendingModal, pendingTitle] =
    useModal()
  const [usersListdata, setUsersListData] = useState([])
  const authUserId = useSelector((state) => state.auth.user.id)
  const token = useSelector((state) => state.auth.token)

  let acceptedFollowers = []
  let pendingFollowers = []
  user.followers.forEach((f) => {
    if (f.accepted) {
      acceptedFollowers.push(f)
    } else {
      pendingFollowers.push(f)
    }
  })

  const acceptedFollowing = user.following.filter((f) => f.accepted === true)

  const followersClickHandler = () => {
    setUsersListData(acceptedFollowers)
    showModal(`${user.username}'s followers`)
  }
  const followingClickHandler = () => {
    setUsersListData(acceptedFollowing)
    showModal(`${user.username} following`)
  }

  const followUnfollowUserHandler = async () => {
    try {
      const response = await followUnfollow({
        url: `/users/${user.id}/follow`,
        method: "POST",
        token,
      })
      if (response.status === 200) onFollowUnfollow()
    } catch {}
  }

  const isUserFollowing = acceptedFollowers.some((f) => f.id === authUserId)
  const isFollowPending = user.followers.some((f) => f.id === authUserId)
  const followButton = (
    <>
      <Button
        onClick={followUnfollowUserHandler}
        variant={`${
          isUserFollowing ? "light" : isFollowPending ? "secondary" : "primary"
        }`}
      >{`${
        isUserFollowing ? "Unfollow" : isFollowPending ? "Pending" : "Follow"
      }`}</Button>
      {isLoading && (
        <Spinner
          animation="border"
          role="status"
          style={{ marginLeft: "20px" }}
        />
      )}
    </>
  )

  const pendingFollowersClick = () => {
    showPendingModal("Pending followers")
  }

  const pendingFollowersButton = (
    <Button
      onClick={pendingFollowersClick}
      variant="secondary"
      style={{ marginLeft: "10px" }}
    >
      Pending Followers {pendingFollowers.length}
    </Button>
  )

  const removeFollowerHandler = async () => {
    try {
      const response = await removeFollower({
        url: `/users/${user.id}/follow`,
        method: "DELETE",
        token,
      })
      if (!response.status) return
      onRemoveFollower()
    } catch {}
  }

  const removeFollowerButton = (
    <>
      <Button
        onClick={removeFollowerHandler}
        variant="danger"
        style={{ marginLeft: "10px" }}
      >
        Remove follower
      </Button>
      {isRemovingFollower && (
        <Spinner
          animation="border"
          role="status"
          style={{ marginLeft: "20px" }}
        />
      )}
    </>
  )

  const editProfileButton = (
    <Link to="/profile/edit" className="btn btn-info">
      Edit profile
    </Link>
  )

  const profileClickHandler = () => {
    hideModal()
    hidePendingModal()
  }

  const followerAcceptHandler = (userId) => {
    onFollowerAccept(userId)
  }

  const pendingFollowerRemoveHandler = (userId) => {
    onPendingFollowerRemove(userId)
  }

  return (
    <>
      <MainModal show={modalShowed} onHide={hideModal} title={title}>
        <UsersList users={usersListdata} onProfileClick={profileClickHandler} />
      </MainModal>
      <MainModal
        show={pendingModalShowed}
        onHide={hidePendingModal}
        title={pendingTitle}
      >
        <PendingFollowersList
          users={pendingFollowers}
          onProfileClick={profileClickHandler}
          onFollowerAccept={followerAcceptHandler}
          onPendingFollowerRemove={pendingFollowerRemoveHandler}
        />
      </MainModal>
      <Card className={`mt-5 m-auto ${classes.card}`}>
        <Card.Body className="d-lg-flex m-lg-4">
          <div className={classes.userImage}>
            <ProfilePicture pictureURL={user.pictureURL} width={200} />
          </div>
          <div className={classes.userContent}>
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            <h4>username: {user.username}</h4>
            <p className="text-muted">email: {user.email}</p>
            <div className="d-flex">
              <p
                className="text-muted"
                style={{ cursor: "pointer" }}
                onClick={followersClickHandler}
              >
                Followers:{" "}
                <span className="fw-bold">{acceptedFollowers.length}</span>
              </p>
              <p
                className="text-muted"
                style={{ cursor: "pointer", marginLeft: "20px" }}
                onClick={followingClickHandler}
              >
                Following:{" "}
                <span className="fw-bold">{acceptedFollowing.length}</span>
              </p>
            </div>
            <div className="d-flex">
              {authUserId !== user.id && followButton}
              {authUserId === user.id && editProfileButton}
              {authUserId === user.id &&
                pendingFollowers.length > 0 &&
                pendingFollowersButton}
              {user.following.find((f) => f.id === authUserId) &&
                removeFollowerButton}
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default UserDetails
