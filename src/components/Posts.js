import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Post from "./Post";

const API_URL = process.env.REACT_APP_API_URL;

const Posts = ({ userId }) => {
  const token = useSelector((state) => state.auth.token);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data.posts);
        setError(null);
      } catch (error) {
        setError("Something went wrong");
        setPosts([]);
      }
    };
    getPosts();
  }, [userId, token]);
  return (
    <>
      <Card className="mt-5 w-50 m-auto">
        <Card.Header>Posts</Card.Header>
        <Card.Body>
          {error && (
            <p
              className="text-center text-muted mt-5"
              style={{ fontSize: "2rem" }}
            >
              {error}
            </p>
          )}

          {posts &&
            posts.map((post) => (
              <Post key={post.id} id={post.id} text={post.text} />
            ))}
        </Card.Body>
      </Card>
    </>
  );
};

export default Posts;
