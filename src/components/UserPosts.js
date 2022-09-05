import React from "react"
import Card from "react-bootstrap/Card"
import NewPostForm from "./NewPostForm"
import { useSelector } from "react-redux"
import useAxios from "../hooks/use-axios"
import PostsList from "./PostsList"
import classes from "./UserPosts.module.css"

const UserPosts = ({
  user,
  posts,
  onAddPost,
  onPostLike,
  onPostDelete,
  onSubmitComment,
  onCommentDelete,
  onUpdatePost,
}) => {
  const authUserId = useSelector((state) => state.auth.user.id)
  const token = useSelector((state) => state.auth.token)

  const {
    isLoading: addPostLoading,
    error: addPostError,
    sendRequest: addPost,
  } = useAxios()

  const postSubmitHandler = async (text) => {
    try {
      const response = await addPost({
        url: "/posts",
        method: "POST",
        data: { text },
        token,
      })
      const newPost = {
        id: response.data.id,
        text: response.data.text,
        user: {
          id: user.id,
          username: user.username,
          pictureURL: user.pictureURL,
        },
        comments: [],
        likes: [],
      }
      if (response.status === 201) onAddPost(newPost)
    } catch {}
  }

  const postDeleteHandler = async (postId) => {
    onPostDelete(postId)
  }

  const postLikeHandler = (postId) => {
    onPostLike(postId)
  }

  const commentSubmitHandler = (postId, newComment) => {
    onSubmitComment(postId, newComment)
  }

  const commentDeleteHandler = (postId, commentId) => {
    onCommentDelete(postId, commentId)
  }

  const updatePostHandler = (postId, text) => {
    onUpdatePost(postId, text)
  }

  return (
    <Card className={`mt-5 mb-5 m-auto ${classes.card}`}>
      <Card.Header style={{ fontSize: "2.2rem" }} className="text-center">
        {`${user.username}'s`} posts
      </Card.Header>
      <Card.Body>
        {user.id === authUserId && (
          <NewPostForm
            onSubmitPost={postSubmitHandler}
            addPostLoading={addPostLoading}
            addPostError={addPostError}
          />
        )}

        <PostsList
          posts={posts}
          onPostLike={postLikeHandler}
          onPostDelete={postDeleteHandler}
          onSubmitComment={commentSubmitHandler}
          onCommentDelete={commentDeleteHandler}
          onUpdatePost={updatePostHandler}
        />
      </Card.Body>
    </Card>
  )
}

export default UserPosts
