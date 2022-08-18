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

const Post = ({
  id,
  text,
  userId,
  username,
  comments,
  likes,
  onPostLike,
  onPostDelete,
  onCommentSubmit,
  onCommentDelete,
}) => {
  const token = useSelector((state) => state.auth.token)
  const { sendRequest: likeUnlike } = useAxios()
  const { isLoading: deletingPost, sendRequest: deletePost } = useAxios()
  const [modalShowed, showModal, hideModal, title] = useModal()
  const authUserId = useSelector((state) => state.auth.user.id)
  const [commmentsVisible, setCommentsVisible] = useState(false)

  const likeUnlikePostHandler = async () => {
    const response = await likeUnlike({
      url: `/posts/${id}/likes`,
      method: "POST",
      token,
    })
    if (response.status === 200) onPostLike(id)
  }

  const userLiked = likes.some((l) => l.id === authUserId)

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

  const commentSubmitHandler = (commentText) => {
    onCommentSubmit(id, commentText)
  }

  const commentDeleteHandler = (commentId) => {
    onCommentDelete(id, commentId)
  }

  return (
    <>
      <MainModal show={modalShowed} onHide={hideModal} title={title}>
        <UsersList users={likes} />
      </MainModal>
      <Card className="mt-2">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <p className="fw-bold">
              <Link to={`/profile/${userId}`}>{username}</Link>
            </p>
            {userId === authUserId && (
              <Button variant="danger" size="sm" onClick={deletePostHandler}>
                Delete
              </Button>
            )}
          </div>
          <p style={{ fontSize: "1.3rem" }}>{text}</p>
          <div className="d-flex w-100 fw-bold" style={{ fontSize: "1.3rem" }}>
            <div>
              <span onClick={likesClickHandler} style={{ cursor: "pointer" }}>
                {likes.length}{" "}
              </span>
              <span
                onClick={likeUnlikePostHandler}
                style={{ cursor: "pointer" }}
                className={`${userLiked ? "text-primary" : ""}`}
              >
                <AiFillLike />
              </span>
            </div>
            <div
              style={{ marginLeft: "25px", cursor: "pointer" }}
              onClick={commentsClickHandler}
            >
              <span>{comments.length} </span>
              <span>
                <FaComment />
              </span>
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
