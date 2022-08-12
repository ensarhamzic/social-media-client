import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

const Post = ({ id, text, userId, username, comments, likes }) => {
  return (
    <Card className="mt-2">
      <Card.Body>
        <p className="fw-bold">
          <Link to={`/profile/${userId}`}>{username}</Link>
        </p>
        <p style={{ fontSize: "1.3rem" }}>{text}</p>
        <div className="d-flex w-100 fw-bold" style={{ fontSize: "1.3rem" }}>
          <div>
            {likes.length} <AiFillLike />
          </div>
          <div style={{ marginLeft: "25px" }}>
            {comments.length} <FaComment />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
