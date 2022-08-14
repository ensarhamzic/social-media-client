import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import ProfilePicture from "./ProfilePicture";
import MainModal from "./MainModal";
import UsersList from "./UsersList";

const UserDetails = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [usersListData, setUsersListData] = useState([]);
  const [modalTitle, setModalTitle] = useState(null);
  const followersClickHandler = () => {
    setModalTitle(`${user.username}'s followers`);
    setUsersListData(user.followers);
    setShowModal(true);
  };
  const followingClickHandler = () => {
    setModalTitle(`${user.username} following`);
    setUsersListData(user.following);
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  return (
    <>
      <MainModal show={showModal} onHide={hideModalHandler} title={modalTitle}>
        <UsersList users={usersListData} onProfileClick={hideModalHandler} />
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
