import React, { useRef, useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { AiFillEye } from "react-icons/ai"
import { AiFillEyeInvisible } from "react-icons/ai"
import InputGroup from "react-bootstrap/InputGroup"

const LoginForm = ({ onFormSubmit, loginError }) => {
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const formValid = !usernameError && !passwordError
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const usernameInputRef = useRef()
  const passwordInputRef = useRef()

  const formSubmitHandler = (event) => {
    event.preventDefault()
    const username = usernameInputRef.current.value
    const password = passwordInputRef.current.value
    if (username.trim() === "") setUsernameError("Must not be empty")
    else setUsernameError(null)

    if (password.length < 8)
      setPasswordError("Must be at least 8 characters long")
    else setPasswordError(null)
    setFormSubmitted(true)
  }

  useEffect(() => {
    if (formValid && formSubmitted) {
      const userData = {
        username: usernameInputRef.current.value,
        password: passwordInputRef.current.value,
      }
      onFormSubmit(userData)
      setFormSubmitted(false)
    }
  }, [formValid, formSubmitted, onFormSubmit])

  const passwordVisibilityToggler = () => {
    setPasswordVisible((prevState) => !prevState)
  }

  return (
    <Form onSubmit={formSubmitHandler}>
      <Form.Group controlId="username" className="mt-1">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Username"
          ref={usernameInputRef}
        />
        {usernameError && <p className="text-danger">{usernameError}</p>}
      </Form.Group>
      <Form.Group controlId="password" className="mt-1">
        <Form.Label>Password</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type={!passwordVisible ? "password" : "text"}
            placeholder="Password"
            ref={passwordInputRef}
          />
          <InputGroup.Text
            onClick={passwordVisibilityToggler}
            style={{ cursor: "pointer", fontSize: "1.3rem" }}
          >
            {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </InputGroup.Text>
        </InputGroup>
        {passwordError && <p className="text-danger">{passwordError}</p>}
      </Form.Group>
      {loginError && <p className="text-danger">{loginError}</p>}
      <Button variant="primary" type="submit" className="mt-3">
        Login
      </Button>
    </Form>
  )
}

export default LoginForm
