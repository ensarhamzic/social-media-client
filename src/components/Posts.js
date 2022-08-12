import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Post from "./Post";
import NewPostForm from "./NewPostForm";

const API_URL = process.env.REACT_APP_API_URL;

const Posts = ({ userId }) => {
  const token = useSelector((state) => state.auth.token);
  const authUserId = useSelector((state) => state.auth.user.id);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(
          response.data.posts.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })
        );
        setUser({ id: response.data.id, username: response.data.username });
        setError(null);
      } catch (error) {
        setError("Something went wrong");
        setPosts([]);
      }
    };
    getPosts();
  }, [userId, token]);

  const postSubmitHandler = async (text) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newPost = {
        id: response.data.id,
        text: response.data.text,
        userId: user.id,
        username: user.username,
        comments: [],
        likes: [],
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {}
  };

  return (
    <>
      <Card className="mt-5 w-50 m-auto">
        <Card.Header style={{ fontSize: "2.2rem" }} className="text-center">
          {`${user.username}'s`} posts
        </Card.Header>
        <Card.Body>
          {parseInt(userId) === authUserId && (
            <NewPostForm onSubmitPost={postSubmitHandler} />
          )}
          {error && (
            <p
              className="text-center text-muted mt-5"
              style={{ fontSize: "2rem" }}
            >
              {error}
            </p>
          )}

          {!error &&
            posts &&
            posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                text={post.text}
                userId={user.id}
                username={user.username}
                comments={post.comments}
                likes={post.likes}
              />
            ))}
        </Card.Body>
      </Card>
    </>
  );
};

export default Posts;
