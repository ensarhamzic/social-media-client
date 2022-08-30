import React, { useRef, useState, useEffect } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"

const RegisterForm = ({ onFormSubmit, registerError }) => {
  const [firstNameError, setFirstNameError] = useState(null)
  const [lastNameError, setLastNameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false)
  const formValid =
    !firstNameError &&
    !lastNameError &&
    !emailError &&
    !usernameError &&
    !passwordError
  const firstNameInputRef = useRef()
  const lastNameInputRef = useRef()
  const emailInputRef = useRef()
  const usernameInputRef = useRef()
  const passwordInputRef = useRef()
  const confirmPasswordInputRef = useRef()

  const validateUserData = (userData) => {
    if (userData.firstName.trim() === "") setFirstNameError("Must not be empty")
    else setFirstNameError(null)

    if (userData.lastName.trim() === "") setLastNameError("Must not be empty")
    else setLastNameError(null)

    const emailReg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!userData.email.toLowerCase().match(emailReg))
      setEmailError("Must be in format of example@company.com")
    else setEmailError(null)

    if (userData.username.trim() === "") setUsernameError("Must not be empty")
    else setUsernameError(null)

    if (userData.password.length < 8)
      setPasswordError("Must be at least 8 characters long")
    else if (userData.password !== userData.confirmPassword)
      setPasswordError("Passwords do not match")
    else setPasswordError(null)
  }

  const formSubmitHandler = (event) => {
    event.preventDefault()
    const userData = {
      firstName: firstNameInputRef.current.value,
      lastName: lastNameInputRef.current.value,
      email: emailInputRef.current.value,
      username: usernameInputRef.current.value,
      password: passwordInputRef.current.value,
      confirmPassword: confirmPasswordInputRef.current.value,
    }

    validateUserData(userData)
    setFormSubmitted(true)
  }

  useEffect(() => {
    if (formValid && formSubmitted) {
      const userData = {
        firstName: firstNameInputRef.current.value,
        lastName: lastNameInputRef.current.value,
        email: emailInputRef.current.value,
        username: usernameInputRef.current.value,
        password: passwordInputRef.current.value,
        confirmPassword: confirmPasswordInputRef.current.value,
      }
      onFormSubmit(userData)
      setFormSubmitted(false)
    }
  }, [formValid, formSubmitted, onFormSubmit])

  const passwordVisibilityToggler = () => {
    setPasswordVisible((prevState) => !prevState)
  }
  const repeatPasswordVisibilityToggler = () => {
    setRepeatPasswordVisible((prevState) => !prevState)
  }

  return (
    <Form onSubmit={formSubmitHandler}>
      <Form.Group controlId="firstName" className="mt-1">
        <Form.Label>First name</Form.Label>
        <Form.Control
          type="text"
          placeholder="First name"
          ref={firstNameInputRef}
        />
        {firstNameError && <p className="text-danger">{firstNameError}</p>}
      </Form.Group>
      <Form.Group controlId="lastName" className="mt-1">
        <Form.Label>Last name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Last name"
          ref={lastNameInputRef}
        />
        {lastNameError && <p className="text-danger">{lastNameError}</p>}
      </Form.Group>
      <Form.Group controlId="email" className="mt-1">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter email"
          ref={emailInputRef}
        />
        {emailError && <p className="text-danger">{emailError}</p>}
      </Form.Group>
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
        <div className="d-flex align-items-center">
          <Form.Control
            type={!passwordVisible ? "password" : "text"}
            placeholder="Password"
            ref={passwordInputRef}
          />
          <div
            onClick={passwordVisibilityToggler}
            style={{
              cursor: "pointer",
              fontSize: "1.5rem",
              paddingLeft: "10px",
              textAlign: "center",
              margin: "0",
            }}
          >
            {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>

        {passwordError && <p className="text-danger">{passwordError}</p>}
      </Form.Group>
      <Form.Group controlId="confirmPassword" className="mt-1">
        <Form.Label>Confirm password</Form.Label>
        <div className="d-flex align-items-center">
          <Form.Control
            type={!repeatPasswordVisible ? "password" : "text"}
            placeholder="Confirm password"
            ref={confirmPasswordInputRef}
          />
          <div
            onClick={repeatPasswordVisibilityToggler}
            style={{
              cursor: "pointer",
              fontSize: "1.5rem",
              paddingLeft: "10px",
              textAlign: "center",
              margin: "0",
            }}
          >
            {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>
      </Form.Group>
      {registerError && <p className="text-danger">{registerError}</p>}
      <Button variant="primary" type="submit" className="mt-3">
        Register
      </Button>
    </Form>
  )
}

export default RegisterForm
