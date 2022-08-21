import React, { useState, useReducer, useEffect } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useSelector } from "react-redux"

const formReducer = (state, action) => {
  switch (action.type) {
    case "firstNameChange":
      return {
        ...state,
        firstName: { ...state.firstName, value: action.value },
      }
    case "lastNameChange":
      return {
        ...state,
        lastName: { ...state.lastName, value: action.value },
      }
    case "emailChange":
      return {
        ...state,
        email: { ...state.email, value: action.value },
      }
    case "usernameChange":
      return {
        ...state,
        username: { ...state.username, value: action.value },
      }
    case "passwordChange":
      return {
        ...state,
        password: { ...state.password, value: action.value },
      }
    case "validateForm":
      let firstNameError = null
      let lastNameError = null
      let emailError = null
      let usernameError = null
      let passwordError = null
      if (state.firstName.value.trim() === "")
        firstNameError = "Must not be empty"
      else firstNameError = null

      if (state.lastName.value.trim() === "")
        lastNameError = "Must not be empty"
      else lastNameError = null

      const emailReg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!state.email.value.toLowerCase().match(emailReg))
        emailError = "Must be in format of example@company.com"
      else emailError = null

      if (state.username.value.trim() === "")
        usernameError = "Must not be empty"
      else usernameError = null

      if (state.password.value.length > 0 && state.password.value.length < 8)
        passwordError = "Must be at least 8 characters long"
      else passwordError = null

      return {
        ...state,
        firstName: { ...state.firstName, error: firstNameError },
        lastName: { ...state.lastName, error: lastNameError },
        email: { ...state.email, error: emailError },
        username: { ...state.username, error: usernameError },
        password: { ...state.password, error: passwordError },
      }

    default:
      return { ...state }
  }
}

const UpdateUserForm = ({ onFormSubmit, updateError }) => {
  const authUser = useSelector((state) => state.auth.user)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const initialState = {
    firstName: {
      value: authUser.firstName,
      error: null,
    },
    lastName: {
      value: authUser.lastName,
      error: null,
    },
    email: {
      value: authUser.email,
      error: null,
    },
    username: {
      value: authUser.username,
      error: null,
    },
    password: {
      value: "",
      error: null,
    },
  }
  const [formState, dispatchForm] = useReducer(formReducer, initialState)
  const formValid =
    !formState.firstName.error &&
    !formState.firstName.error &&
    !formState.email.error &&
    !formState.username.error &&
    !formState.password.error

  const firstName = formState.firstName.value
  const lastName = formState.lastName.value
  const username = formState.username.value
  const email = formState.email.value
  const password = formState.password.value

  const formSubmitHandler = (event) => {
    event.preventDefault()
    dispatchForm({ type: "validateForm" })
    setFormSubmitted(true)
  }

  useEffect(() => {
    if (formValid && formSubmitted) {
      const userData = {
        firstName,
        lastName,
        email,
        username,
        password,
      }
      onFormSubmit(userData)
      setFormSubmitted(false)
    }
  }, [
    formValid,
    formSubmitted,
    onFormSubmit,
    firstName,
    lastName,
    username,
    email,
    password,
  ])

  return (
    <Form onSubmit={formSubmitHandler}>
      <Form.Group controlId="firstName" className="mt-1">
        <Form.Label>First name</Form.Label>
        <Form.Control
          type="text"
          placeholder="First name"
          value={formState.firstName.value}
          onChange={(e) =>
            dispatchForm({ type: "firstNameChange", value: e.target.value })
          }
        />
        {formState.firstName.error && (
          <p className="text-danger">{formState.firstName.error}</p>
        )}
      </Form.Group>
      <Form.Group controlId="lastName" className="mt-1">
        <Form.Label>Last name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Last name"
          value={formState.lastName.value}
          onChange={(e) =>
            dispatchForm({ type: "lastNameChange", value: e.target.value })
          }
        />
        {formState.lastName.error && (
          <p className="text-danger">{formState.lastName.error}</p>
        )}
      </Form.Group>
      <Form.Group controlId="email" className="mt-1">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter email"
          value={formState.email.value}
          onChange={(e) =>
            dispatchForm({ type: "emailChange", value: e.target.value })
          }
        />
        {formState.email.error && (
          <p className="text-danger">{formState.email.error}</p>
        )}
      </Form.Group>
      <Form.Group controlId="username" className="mt-1">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Username"
          value={formState.username.value}
          onChange={(e) =>
            dispatchForm({ type: "usernameChange", value: e.target.value })
          }
        />
        {formState.username.error && (
          <p className="text-danger">{formState.username.error}</p>
        )}
      </Form.Group>
      <Form.Group controlId="password" className="mt-1">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Leave empty to not change"
          value={formState.password.value}
          onChange={(e) =>
            dispatchForm({ type: "passwordChange", value: e.target.value })
          }
        />
        {formState.password.error && (
          <p className="text-danger">{formState.password.error}</p>
        )}
      </Form.Group>
      {updateError && <p className="text-danger">{updateError}</p>}
      <Button variant="primary" type="submit" className="mt-3">
        Update Profile
      </Button>
    </Form>
  )
}

export default UpdateUserForm
