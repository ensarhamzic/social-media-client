import React from "react"
import Post from "./Post"

const PostsList = ({
  posts,
  onPostLike,
  onPostDelete,
  onSubmitComment,
  onCommentDelete,
  onUpdatePost,
}) => {
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

  const postUpdateHandler = (postId, text) => {
    onUpdatePost(postId, text)
  }

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            text={post.text}
            userId={post.user.id}
            pictureURL={post.user.pictureURL}
            username={post.user.username}
            comments={post.comments}
            likes={post.likes}
            onPostLike={postLikeHandler}
            onPostDelete={postDeleteHandler}
            onCommentSubmit={commentSubmitHandler}
            onCommentDelete={commentDeleteHandler}
            onUpdatePost={postUpdateHandler}
          />
        ))}

      {posts.length === 0 && (
        <p
          className="fw-bold"
          style={{ fontSize: "1.2rem", textAlign: "center" }}
        >{`No posts!`}</p>
      )}
    </>
  )
}

export default PostsList
