import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import ProfilePicture from "./ProfilePicture";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { modalActions } from "../store/modal-slice";
import UsersList from "./UsersList";
import MainModal from "./MainModal";
import Button from "react-bootstrap/Button";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const UserDetails = ({ user, onFollowUnfollow }) => {
  const [usersListdata, setUsersListData] = useState([]);
  const authUserId = useSelector((state) => state.auth.user.id);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const followersClickHandler = () => {
    setUsersListData(user.followers);
    dispatch(
      modalActions.show({
        title: `${user.username}'s followers`,
      })
    );
  };
  const followingClickHandler = () => {
    setUsersListData(user.following);
    dispatch(
      modalActions.show({
        title: `${user.username} following`,
      })
    );
  };

  const followUnfollowUserHandler = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/users/${user.id}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onFollowUnfollow(response.data);
    } catch (error) {}
  };

  const isUserFollowing = user.followers.some((f) => f.id === authUserId);
  const followButton = (
    <Button
      onClick={followUnfollowUserHandler}
      variant={`${isUserFollowing ? "light" : "primary"}`}
    >{`${isUserFollowing ? "Unfollow" : "Follow"}`}</Button>
  );
  return (
    <>
      <MainModal>
        <UsersList users={usersListdata} />
      </MainModal>
      <Card className="mt-5 w-75 m-auto">
        <Card.Body className="d-lg-flex m-4">
          <div>
            <ProfilePicture url={user.pictureUrl} width={200} />
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
  );
};

export default UserDetails;
