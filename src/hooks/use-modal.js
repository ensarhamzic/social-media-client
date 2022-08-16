import { useState } from "react"

const useModal = () => {
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState(null)
  const showModal = (modalTitle) => {
    setTitle(modalTitle)
    setShow(true)
  }
  const hideModal = () => {
    setShow(false)
  }

  return [show, showModal, hideModal, title]
}

export default useModal
