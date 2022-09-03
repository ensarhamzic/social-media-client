import React, { useState, useReducer, useEffect } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useDispatch, useSelector } from "react-redux"
import { AiFillEye } from "react-icons/ai"
import { AiFillEyeInvisible } from "react-icons/ai"
import InputGroup from "react-bootstrap/InputGroup"
import useModal from "../hooks/use-modal"
import DeleteProfileModal from "./DeleteProfileModal"
import { authActions } from "../store/auth-slice"

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
    case "deletePictureChange": {
      if (!action.value) {
        return {
          ...state,
          deletePicture: {
            value: action.value,
          },
        }
      } else {
        return {
          ...state,
          deletePicture: {
            value: action.value,
          },
          profilePicture: {
            value: null,
            error: null,
          },
        }
      }
    }
    case "profilePictureChange":
      return {
        ...state,
        profilePicture: {
          ...state.profilePicture,
          value: action.value,
        },
      }
    case "validateForm":
      let firstNameError = null
      let lastNameError = null
      let emailError = null
      let usernameError = null
      let passwordError = null
      let profilePictureError = null
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

      if (state.profilePicture.value) {
        const extension = state.profilePicture.value.name.substr(
          state.profilePicture.value.name.lastIndexOf(".")
        )
        const allowedExtensionsRegx = /(\.jpg|\.jpeg|\.png)$/i
        const isAllowed = allowedExtensionsRegx.test(extension)
        if (!isAllowed)
          profilePictureError = "Must be either .jpg, .jpeg or .png"
        else profilePictureError = null
      }

      return {
        ...state,
        firstName: { ...state.firstName, error: firstNameError },
        lastName: { ...state.lastName, error: lastNameError },
        email: { ...state.email, error: emailError },
        username: { ...state.username, error: usernameError },
        password: { ...state.password, error: passwordError },
        profilePicture: { ...state.profilePicture, error: profilePictureError },
      }

    default:
      return { ...state }
  }
}

const UpdateUserForm = ({ onFormSubmit, updateError }) => {
  const authUser = useSelector((state) => state.auth.user)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [modalShowed, showModal, hideModal, title] = useModal()
  const dispatch = useDispatch()
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
    profilePicture: {
      value: null,
      error: null,
    },
    deletePicture: {
      value: false,
    },
  }
  const [formState, dispatchForm] = useReducer(formReducer, initialState)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const formValid =
    !formState.firstName.error &&
    !formState.firstName.error &&
    !formState.email.error &&
    !formState.username.error &&
    !formState.password.error &&
    !formState.profilePicture.error

  const firstName = formState.firstName.value
  const lastName = formState.lastName.value
  const username = formState.username.value
  const email = formState.email.value
  const password = formState.password.value
  const profilePicture = formState.profilePicture.value
  const deletePicture = formState.deletePicture.value

  const formSubmitHandler = (event) => {
    event.preventDefault()
    dispatchForm({ type: "validateForm" })
    setFormSubmitted(true)
  }

  const passwordVisibilityToggler = () => {
    setPasswordVisible((prevState) => !prevState)
  }

  const deleteProfileButtonClick = () => {
    showModal("Are you sure?")
  }

  useEffect(() => {
    if (formValid && formSubmitted) {
      const userData = {
        firstName,
        lastName,
        email,
        username,
        password,
        profilePicture,
        deletePicture,
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
    profilePicture,
    deletePicture,
  ])

  const onDeleteProfileHandler = () => {
    dispatch(authActions.logout())
  }

  return (
    <>
      <DeleteProfileModal
        show={modalShowed}
        onHide={hideModal}
        title={title}
        onDelete={onDeleteProfileHandler}
        deleteUserId={authUser.id}
      />
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
          <InputGroup className="mb-3">
            <Form.Control
              type={!passwordVisible ? "password" : "text"}
              placeholder="Leave empty to not change"
              value={formState.password.value}
              onChange={(e) =>
                dispatchForm({ type: "passwordChange", value: e.target.value })
              }
            />
            <InputGroup.Text
              onClick={passwordVisibilityToggler}
              style={{ cursor: "pointer", fontSize: "1.3rem" }}
            >
              {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
            </InputGroup.Text>
          </InputGroup>
          {formState.password.error && (
            <p className="text-danger">{formState.password.error}</p>
          )}
        </Form.Group>
        {authUser.pictureURL && (
          <Form.Group controlId="profilePicture" className="mt-3">
            <Form.Check
              type="checkbox"
              id="checkbox"
              label="Delete current profile picture"
              checked={formState.deletePicture.value}
              onChange={(e) =>
                dispatchForm({
                  type: "deletePictureChange",
                  value: e.target.checked,
                })
              }
            />
          </Form.Group>
        )}
        {!deletePicture && (
          <Form.Group controlId="profilePicture" className="mt-1">
            <Form.Label>New Profile Picture</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) =>
                dispatchForm({
                  type: "profilePictureChange",
                  value: e.target.files[0],
                })
              }
            />
            {formState.profilePicture.error && (
              <p className="text-danger">{formState.profilePicture.error}</p>
            )}
          </Form.Group>
        )}
        {updateError && <p className="text-danger">{updateError}</p>}
        <Button variant="primary" type="submit" className="mt-3">
          Update Profile
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={deleteProfileButtonClick}
          className="mt-3"
          style={{ marginLeft: "10px" }}
        >
          Delete profile
        </Button>
      </Form>
    </>
  )
}

export default UpdateUserForm
