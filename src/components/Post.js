import React from "react";
import Card from "react-bootstrap/Card";

const Post = ({ id, text }) => {
  return (
    <Card className="mt-2">
      <Card.Body>
        <p>{text}</p>
      </Card.Body>
    </Card>
  );
};

export default Post;
