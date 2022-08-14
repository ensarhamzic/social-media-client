import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import ProfilePicture from "./ProfilePicture";
import MainModal from "./MainModal";

const UserDetails = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const followersClickHandler = () => {
    setShowModal(true);
  };
  const followingClickHandler = () => {
    setShowModal(true);
  };

  return (
    <>
      {showModal && (
        <MainModal show={showModal} onHide={() => setShowModal(false)} />
      )}
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
