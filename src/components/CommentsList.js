import React from "react"
import Comment from "./Comment"

const CommentsList = ({ comments, onCommentDelete }) => {
  const commentDeleteHandler = (commentId) => {
    onCommentDelete(commentId)
  }
  return (
    <>
      {comments.length > 0 &&
        comments.map((c) => (
          <Comment
            key={c.id}
            id={c.id}
            text={c.text}
            user={c.user}
            onCommentDelete={commentDeleteHandler}
          />
        ))}
      {comments.length === 0 && <p>There are no comments on this post</p>}
    </>
  )
}

export default CommentsList
