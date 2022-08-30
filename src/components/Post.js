import React, { useState, useRef, useEffect } from "react"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import { AiFillLike } from "react-icons/ai"
import { FaComment } from "react-icons/fa"
import { useSelector } from "react-redux"
import MainModal from "./MainModal"
import UsersList from "./UsersList"
import useModal from "../hooks/use-modal"
import Comments from "./Comments"
import useAxios from "../hooks/use-axios"
import Spinner from "react-bootstrap/Spinner"
import ProfilePicture from "./ProfilePicture"
import classes from "./Post.module.css"
import Dropdown from "react-bootstrap/Dropdown"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

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
  onUpdatePost,
}) => {
  const token = useSelector((state) => state.auth.token)
  const authUser = useSelector((state) => state.auth.user)

  const { sendRequest: likeUnlike } = useAxios()
  const { sendRequest: commentPost } = useAxios()
  const {
    isLoading: updatePostLoading,
    error: updatePostError,
    sendRequest: editPost,
  } = useAxios()
  const { isLoading: deletingPost, sendRequest: deletePost } = useAxios()
  const { sendRequest: deleteComment } = useAxios()
  const [modalShowed, showModal, hideModal, title] = useModal()
  const [commmentsVisible, setCommentsVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const likeUnlikePostHandler = async () => {
    const response = await likeUnlike({
      url: `/posts/${id}/likes`,
      method: "POST",
      token,
    })
    if (response.status === 200) onPostLike(id)
  }

  const textInputRef = useRef()
  const [textError, setTextError] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

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

  const editPostClickHandler = () => {
    setIsEditing(true)
  }

  const cancelUpdateClickHandler = () => {
    setIsEditing(false)
  }

  const formSubmitHandler = (e) => {
    e.preventDefault()
    const postText = textInputRef.current.value
    if (postText.trim().length === 0) setTextError("Must not be empty")
    else setTextError(null)
    setFormSubmitted(true)
  }

  useEffect(() => {
    ;(async () => {
      if (!textError && formSubmitted) {
        const text = textInputRef.current.value
        try {
          const response = await editPost({
            url: `/posts/${id}`,
            method: "PUT",
            data: { text },
            token,
          })
          if (!response.status) return
          onUpdatePost(id, text)
          setIsEditing(false)
        } catch {}

        setFormSubmitted(false)
      }
    })()
  }, [textError, formSubmitted, editPost, id, token, onUpdatePost])

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
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-basic"
                  style={{ color: "black" }}
                />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={deletePostHandler}>
                    Delete
                  </Dropdown.Item>
                  <Dropdown.Item onClick={editPostClickHandler}>
                    Edit
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
          {!isEditing && <p style={{ fontSize: "1.3rem" }}>{text}</p>}
          {isEditing && (
            <Form className="mb-5" onSubmit={formSubmitHandler}>
              <Form.Group className="mb-3" controlId="postText">
                <Form.Label>
                  Update post
                  {updatePostLoading && (
                    <Spinner animation="border" role="status" size="sm" />
                  )}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  size="lg"
                  ref={textInputRef}
                  defaultValue={text}
                />
                {textError && <p className="text-danger">{textError}</p>}
                {updatePostError && (
                  <p className="text-danger">{updatePostError}</p>
                )}
              </Form.Group>
              <Button variant="primary" type="submit">
                Update Post
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={cancelUpdateClickHandler}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </Form>
          )}

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
              postUserId={userId}
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
