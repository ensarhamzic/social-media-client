import React, { useState } from "react"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import { AiFillLike } from "react-icons/ai"
import { FaComment } from "react-icons/fa"
import { useSelector } from "react-redux"
import MainModal from "./MainModal"
import UsersList from "./UsersList"
import useModal from "../hooks/use-modal"
import Button from "react-bootstrap/Button"
import Comments from "./Comments"
import useAxios from "../hooks/use-axios"
import Spinner from "react-bootstrap/Spinner"
import ProfilePicture from "./ProfilePicture"
import classes from "./Post.module.css"

const Post = ({
  id,
  text,
  userId,
  username,
  pictureURL,
  comments,
  likes,
  onPostLike,
  onPostDelete,
  onCommentSubmit,
  onCommentDelete,
}) => {
  const token = useSelector((state) => state.auth.token)
  const authUser = useSelector((state) => state.auth.user)

  const { sendRequest: likeUnlike } = useAxios()
  const { sendRequest: commentPost } = useAxios()
  const { isLoading: deletingPost, sendRequest: deletePost } = useAxios()
  const { sendRequest: deleteComment } = useAxios()
  const [modalShowed, showModal, hideModal, title] = useModal()
  const [commmentsVisible, setCommentsVisible] = useState(false)

  const likeUnlikePostHandler = async () => {
    const response = await likeUnlike({
      url: `/posts/${id}/likes`,
      method: "POST",
      token,
    })
    if (response.status === 200) onPostLike(id)
  }

  const userLiked = likes.some((l) => l.id === authUser.id)

  const likesClickHandler = () => {
    showModal("Post likes")
  }

  const deletePostHandler = async () => {
    try {
      const response = await deletePost({
        url: `/posts/${id}`,
        method: "DELETE",
        token,
      })
      if (response.status === 200) onPostDelete(id)
    } catch (error) {}
  }

  const commentsClickHandler = () => {
    setCommentsVisible((prevState) => !prevState)
  }

  const commentSubmitHandler = async (commentText) => {
    try {
      const response = await commentPost({
        url: `/posts/${id}/comments`,
        method: "POST",
        data: { text: commentText },
        token,
      })
      if (!response.status) return
      const newComment = {
        id: response.data.id,
        text: response.data.text,
        user: {
          ...authUser,
        },
      }
      onCommentSubmit(id, newComment)
    } catch {}
  }

  const commentDeleteHandler = async (commentId) => {
    try {
      const response = await deleteComment({
        url: `/posts/${id}/comments/${commentId}`,
        method: "DELETE",
        token,
      })
      if (!response.status) return
      onCommentDelete(id, commentId)
    } catch {}
  }

  const profileClickHandler = () => {
    hideModal()
  }

  return (
    <>
      <MainModal show={modalShowed} onHide={hideModal} title={title}>
        <UsersList users={likes} onProfileClick={profileClickHandler} />
      </MainModal>
      <Card className="mt-2">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <Link
              to={`/profile/${userId}`}
              style={{ color: "black", textDecoration: "none" }}
            >
              <div className="d-flex">
                <ProfilePicture pictureURL={pictureURL} width={40} />
                <p
                  className="fw-bold"
                  style={{ marginTop: "5px", marginLeft: "20px" }}
                >
                  {username}
                </p>
              </div>
            </Link>

            {userId === authUser.id && (
              <Button variant="danger" size="sm" onClick={deletePostHandler}>
                Delete
              </Button>
            )}
          </div>
          <p style={{ fontSize: "1.3rem" }}>{text}</p>
          <div className={`d-flex w-100 fw-bold ${classes.controls}`}>
            <div>
              <span onClick={likesClickHandler} style={{ cursor: "pointer" }}>
                {likes.length}{" "}
              </span>
              <span
                onClick={likeUnlikePostHandler}
                style={{ cursor: "pointer" }}
                className={`${userLiked ? "text-primary" : ""}`}
              >
                <AiFillLike /> Like
              </span>
            </div>
            <div
              style={{ marginLeft: "25px", cursor: "pointer" }}
              onClick={commentsClickHandler}
            >
              <span>
                <FaComment />
              </span>
              <span> {comments.length} Comments </span>
            </div>
            {deletingPost && (
              <Spinner
                animation="border"
                role="status"
                size="sm"
                style={{ marginLeft: "20px", marginTop: "10px" }}
              />
            )}
          </div>
          {commmentsVisible && (
            <Comments
              comments={comments}
              onCommentSubmit={commentSubmitHandler}
              onCommentDelete={commentDeleteHandler}
            />
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default Post
