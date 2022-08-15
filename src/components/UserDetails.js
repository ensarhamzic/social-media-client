import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import ProfilePicture from "./ProfilePicture";
import { useDispatch } from "react-redux/es/exports";
import { modalActions } from "../store/modal-slice";
import UsersList from "./UsersList";
import MainModal from "./MainModal";

const UserDetails = ({ user }) => {
  const [userData, setUserData] = useState([]);
  const dispatch = useDispatch();
  const followersClickHandler = () => {
    setUserData(user.followers);
    dispatch(
      modalActions.show({
        title: `${user.username}'s followers`,
      })
    );
  };
  const followingClickHandler = () => {
    setUserData(user.following);
    dispatch(
      modalActions.show({
        title: `${user.username} following`,
      })
    );
  };

  return (
    <>
      <MainModal>
        <UsersList users={userData} />
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
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserDetails;
