import React from "react"
import NewCommentForm from "./NewCommentForm"
import CommentsList from "./CommentsList"

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
  return (
    <>
      <NewCommentForm onCommentSubmit={commentSubmitHandler} />
      <CommentsList
        comments={comments}
        postUserId={postUserId}
        onCommentDelete={commentDeleteHandler}
      />
    </>
  )
}

export default Comments
