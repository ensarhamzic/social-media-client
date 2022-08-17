import React from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import Card from "react-bootstrap/Card"
import Post from "./Post"
import NewPostForm from "./NewPostForm"

const API_URL = process.env.REACT_APP_API_URL

const Posts = ({
  posts,
  user,
  onAddPost,
  onPostLike,
  onPostDelete,
  onSubmitComment,
  onCommentDelete,
}) => {
  const token = useSelector((state) => state.auth.token)
  const authUserId = useSelector((state) => state.auth.user.id)

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
      )
      const newPost = {
        id: response.data.id,
        text: response.data.text,
        userId: user.id,
        username: user.username,
        comments: [],
        likes: [],
      }
      onAddPost(newPost)
    } catch (error) {}
  }

  const postDeleteHandler = async (postId) => {
    try {
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      onPostDelete(postId)
    } catch (error) {}
  }

  const postLikeHandler = (postId) => {
    onPostLike(postId)
  }

  const commentSubmitHandler = (postId, commentText) => {
    onSubmitComment(postId, commentText)
  }

  const commentDeleteHandler = (postId, commentId) => {
    onCommentDelete(postId, commentId)
  }

  return (
    <>
      <Card className="mt-5 mb-5 w-50 m-auto">
        <Card.Header style={{ fontSize: "2.2rem" }} className="text-center">
          {`${user.username}'s`} posts
        </Card.Header>
        <Card.Body>
          {parseInt(user.id) === authUserId && (
            <NewPostForm onSubmitPost={postSubmitHandler} />
          )}

          {posts.length > 0 &&
            posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                text={post.text}
                userId={user.id}
                username={user.username}
                comments={post.comments}
                likes={post.likes}
                onPostLike={postLikeHandler}
                onPostDelete={postDeleteHandler}
                onCommentSubmit={commentSubmitHandler}
                onCommentDelete={commentDeleteHandler}
              />
            ))}

          {posts.length === 0 && (
            <p
              className="fw-bold"
              style={{ fontSize: "1.2rem", textAlign: "center" }}
            >{`${user.username} has no posts!`}</p>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default Posts
