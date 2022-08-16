import React, { useState, useRef, useEffect } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const NewCommentForm = ({ onCommentSubmit }) => {
  const textInputRef = useRef()
  const [textError, setTextError] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const formSubmitHandler = (event) => {
    event.preventDefault()
    const commentText = textInputRef.current.value
    if (commentText.trim().length === 0) setTextError("Must not be empty")
    else setTextError(null)
    setFormSubmitted(true)
  }

  useEffect(() => {
    if (!textError && formSubmitted) {
      const text = textInputRef.current.value
      onCommentSubmit(text)
      textInputRef.current.value = ""
      setFormSubmitted(false)
    }
  }, [textError, formSubmitted, onCommentSubmit])
  return (
    <Form className="mb-5 mt-3" onSubmit={formSubmitHandler}>
      <Form.Group className="mb-3" controlId="postText">
        <Form.Label>Comment this post</Form.Label>
        <Form.Control as="textarea" rows={3} size="sm" ref={textInputRef} />
        {textError && <p className="text-danger">{textError}</p>}
      </Form.Group>
      <Button variant="primary" type="submit">
        Add Post
      </Button>
    </Form>
  )
}

export default NewCommentForm
