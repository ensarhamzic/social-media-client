import React from "react"
import NewCommentForm from "./NewCommentForm"
import CommentsList from "./CommentsList"
import { useSelector } from "react-redux"

const Comments = ({
  comments,
  postUserId,
  onCommentSubmit,
  onCommentDelete,
}) => {
  const commentSubmitHandler = (commentText) => {
    onCommentSubmit(commentText)
  }
  const commentDeleteHandler = (commentId) => {
    onCommentDelete(commentId)
  }
  const authUser = useSelector((state) => state.auth.user)
  return (
    <>
      {authUser.role === "User" && (
        <NewCommentForm onCommentSubmit={commentSubmitHandler} />
      )}
      <CommentsList
        comments={comments}
        postUserId={postUserId}
        onCommentDelete={commentDeleteHandler}
      />
    </>
  )
}

export default Comments
