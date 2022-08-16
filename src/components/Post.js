import React, { useState } from "react"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import { AiFillLike } from "react-icons/ai"
import { FaComment } from "react-icons/fa"
import axios from "axios"
import { useSelector } from "react-redux"
import MainModal from "./MainModal"
import UsersList from "./UsersList"
import useModal from "../hooks/use-modal"
import Button from "react-bootstrap/Button"
import Comments from "./Comments"

const API_URL = process.env.REACT_APP_API_URL

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
}) => {
  const [modalShowed, showModal, hideModal, title] = useModal()
  const token = useSelector((state) => state.auth.token)
  const authUserId = useSelector((state) => state.auth.user.id)
  const [commmentsVisible, setCommentsVisible] = useState(false)

  const likeUnlikePostHandler = async () => {
    try {
      await axios.post(
        `${API_URL}/posts/${id}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      onPostLike(id)
    } catch (error) {}
  }

  const userLiked = likes.some((l) => l.id === authUserId)

  const likesClickHandler = () => {
    showModal("Post likes")
  }

  const deletePostHandler = () => {
    onPostDelete(id)
  }

  const commentsClickHandler = () => {
    setCommentsVisible((prevState) => !prevState)
  }

  const commentSubmitHandler = (commentText) => {
    onCommentSubmit(id, commentText)
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
          </div>
          {commmentsVisible && (
            <Comments
              comments={comments}
              onCommentSubmit={commentSubmitHandler}
            />
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default Post
