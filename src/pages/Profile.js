import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Posts from "../components/Posts";
import axios from "axios";
import UserDetails from "../components/UserDetails";

const API_URL = process.env.REACT_APP_API_URL;

const Profile = ({ forAuthUser }) => {
  let userId = useSelector((state) => state.auth.user.id);
  const authUser = useSelector((state) => state.auth.user);
  let { id: userIdParam } = useParams();
  if (!forAuthUser) userId = userIdParam;

  const token = useSelector((state) => state.auth.token);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const following = response.data.following.map((f) => {
          return { ...f.following };
        });
        const followers = response.data.followers.map((f) => {
          return { ...f.user };
        });

        const formattedPosts = response.data.posts.map((p) => {
          const newLikes = p.likes.map((l) => {
            if (!l.user) {
              // Backend returns empty object if there is currently authenticated user in the likes array
              return { ...authUser };
            }
            return { ...l.user };
          });
          return { ...p, likes: newLikes };
        });

        setPosts(
          formattedPosts.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })
        );
        setUser({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          pictureUrl: response.data.pictureUrl,
          followers,
          following,
        });
        setError(null);
      } catch (error) {
        setError("Something went wrong");
        setPosts([]);
      }
    };
    getPosts();
  }, [userId, token, authUser]);

  const addPostHandler = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const followUnfollowHandler = () => {
    const newFollowers = [...user.followers];
    const foundUserIndex = newFollowers.findIndex((f) => f.id === authUser.id);
    if (foundUserIndex > -1) newFollowers.splice(foundUserIndex, 1);
    else newFollowers.push(authUser);
    setUser({ ...user, followers: newFollowers });
  };

  const postLikeHandler = (postId) => {
    const newPost = { ...posts.find((p) => p.id === postId) };
    const foundUserIndex = newPost.likes.findIndex((l) => l.id === authUser.id);
    if (foundUserIndex > -1) newPost.likes.splice(foundUserIndex, 1);
    else newPost.likes.push(authUser);
    const newPosts = posts.map((p) => {
      if (p.id === postId) return newPost;
      return { ...p };
    });
    setPosts(newPosts);
  };

  return (
    <div>
      {error && (
        <p className="text-center text-muted mt-5" style={{ fontSize: "2rem" }}>
          {error}
        </p>
      )}
      {!error && user && (
        <UserDetails user={user} onFollowUnfollow={followUnfollowHandler} />
      )}
      {!error && user && (
        <Posts
          user={user}
          posts={posts}
          onAddPost={addPostHandler}
          onPostLike={postLikeHandler}
        />
      )}
    </div>
  );
};

export default Profile;
