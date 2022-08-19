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

const UserDetails = ({ user, onFollowUnfollow }) => {
  const { isLoading, sendRequest: followUnfollow } = useAxios()
  const [modalShowed, showModal, hideModal, title] = useModal()
  const [usersListdata, setUsersListData] = useState([])
  const authUserId = useSelector((state) => state.auth.user.id)
  const token = useSelector((state) => state.auth.token)
  const followersClickHandler = () => {
    setUsersListData(user.followers)
    showModal(`${user.username}'s followers`)
  }
  const followingClickHandler = () => {
    setUsersListData(user.following)
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

  const isUserFollowing = user.followers.some((f) => f.id === authUserId)
  const followButton = (
    <div className="d-flex">
      <Button
        onClick={followUnfollowUserHandler}
        variant={`${isUserFollowing ? "light" : "primary"}`}
      >{`${isUserFollowing ? "Unfollow" : "Follow"}`}</Button>
      {isLoading && (
        <Spinner
          animation="border"
          role="status"
          style={{ marginLeft: "20px" }}
        />
      )}
    </div>
  )
  return (
    <>
      <MainModal show={modalShowed} onHide={hideModal} title={title}>
        <UsersList users={usersListdata} />
      </MainModal>
      <Card className="mt-5 w-75 m-auto">
        <Card.Body className="d-lg-flex m-4">
          <div>
            <ProfilePicture url={user.pictureURL} width={200} />
          </div>
          <div
            style={{
              marginLeft: "50px",
            }}
          >
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
                <span className="fw-bold">{user.followers.length}</span>
              </p>
              <p
                className="text-muted"
                style={{ cursor: "pointer", marginLeft: "20px" }}
                onClick={followingClickHandler}
              >
                Following:{" "}
                <span className="fw-bold">{user.following.length}</span>
              </p>
            </div>
            {authUserId !== user.id && followButton}
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default UserDetails
