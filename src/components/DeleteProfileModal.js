import React from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { useSelector } from "react-redux"
import useAxios from "../hooks/use-axios"

const DeleteProfileModal = ({
  show,
  onHide,
  title,
  deleteUserId,
  onDelete,
}) => {
  const token = useSelector((state) => state.auth.token)

  const { error, sendRequest: deleteProfile } = useAxios()

  const deleteProfileHandler = () => {
    try {
      ;(async () => {
        const response = await deleteProfile({
          url: `/users/${deleteUserId}`,
          method: "DELETE",
          token,
          errorMessage: "An error occured",
        })
        if (!response.status) return
        onDelete()
      })()
    } catch {}
  }
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>This action cannot be undone</h4>
        <h5>
          All your posts, commens, likes, following and followers will be
          deleted
        </h5>
        {error && <p className="text-danger">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={deleteProfileHandler}>
          Yes
        </Button>
        <Button variant="danger" onClick={onHide}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteProfileModal
