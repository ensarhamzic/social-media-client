import React from "react"
import Card from "react-bootstrap/Card"
import NewPostForm from "./NewPostForm"
import { useSelector } from "react-redux/es/exports"
import useAxios from "../hooks/use-axios"
import PostsList from "./PostsList"

const UserPosts = ({
  user,
  posts,
  onAddPost,
  onPostLike,
  onPostDelete,
  onSubmitComment,
  onCommentDelete,
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

  const commentSubmitHandler = (postId, commentText) => {
    onSubmitComment(postId, commentText)
  }

  const commentDeleteHandler = (postId, commentId) => {
    onCommentDelete(postId, commentId)
  }
  return (
    <Card className="mt-5 mb-5 w-50 m-auto">
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
        />
      </Card.Body>
    </Card>
  )
}

export default UserPosts
