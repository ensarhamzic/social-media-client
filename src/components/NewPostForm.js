import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const NewPostForm = ({ onSubmitPost }) => {
  const textInputRef = useRef();
  const [textError, setTextError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formSubmitHandler = (event) => {
    event.preventDefault();
    const postText = textInputRef.current.value;
    if (postText.trim().length === 0) setTextError("Must not be empty");
    else setTextError(null);
    setFormSubmitted(true);
  };

  useEffect(() => {
    if (!textError && formSubmitted) {
      const text = textInputRef.current.value;
      onSubmitPost(text);
      textInputRef.current.value = "";
      setFormSubmitted(false);
    }
  }, [textError, formSubmitted, onSubmitPost]);
  return (
    <Form className="mb-5" onSubmit={formSubmitHandler}>
      <Form.Group className="mb-3" controlId="postText">
        <Form.Label>Add New Post</Form.Label>
        <Form.Control as="textarea" rows={3} size="lg" ref={textInputRef} />
        {textError && <p className="text-danger">{textError}</p>}
      </Form.Group>
      <Button variant="primary" type="submit">
        Add Post
      </Button>
    </Form>
  );
};

export default NewPostForm;
