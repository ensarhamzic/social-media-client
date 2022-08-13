import React from "react";
import Card from "react-bootstrap/Card";

const UserDetails = ({ user }) => {
  return (
    <Card className="mt-5 w-75 m-auto">
      <Card.Body className="d-lg-flex m-4">
        <div>
          <img
            style={{ borderRadius: "50%" }}
            src={user.pictureUrl ?? "https://via.placeholder.com/200"}
            alt="placeholder"
          />
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
          <p className="text-muted">
            Followers: <span className="fw-bold">{user.followers.length}</span>{" "}
            &nbsp;&nbsp;&nbsp; Following:{" "}
            <span className="fw-bold">{user.following.length}</span>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserDetails;
