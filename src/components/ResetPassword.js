import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import useAxios from "../hooks/use-axios"
import Card from "react-bootstrap/Card"
import Spinner from "react-bootstrap/Spinner"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import classes from "../pages/Login.module.css"
import { AiFillEye } from "react-icons/ai"
import { AiFillEyeInvisible } from "react-icons/ai"
import InputGroup from "react-bootstrap/InputGroup"

const ResetPassword = ({ cancelRedirect }) => {
  const params = useParams()
  const resetToken = params.resetToken

  const {
    isLoading: isResetting,
    error: resetError,
    sendRequest: resetPassword,
  } = useAxios()

  const [passwordError, setPasswordError] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const passwordInputRef = useRef()

  const formSubmitHandler = async (e) => {
    e.preventDefault()
    const newPassword = passwordInputRef.current.value
    if (newPassword.trim().length < 8) {
      setPasswordError("Must be at least 8 characters long")
    } else {
      setPasswordError(null)
      setFormSubmitted(true)
    }
  }

  useEffect(() => {
    cancelRedirect()
  }, [cancelRedirect])

  useEffect(() => {
    ;(async () => {
      if (!passwordError && formSubmitted) {
        const newPassword = passwordInputRef.current.value
        try {
          const response = await resetPassword({
            url: `/users/reset-password`,
            method: "PATCH",
            data: { resetToken, newPassword },
          })
          if (!response.status) return
          setResetSuccess(true)
          passwordInputRef.current.value = ""
        } catch {}
        setFormSubmitted(false)
      }
    })()
  }, [formSubmitted, passwordError, resetToken, resetPassword])

  const passwordVisibilityToggler = () => {
    setPasswordVisible((prevState) => !prevState)
  }

  return (
    <Card className={`mt-5 m-auto ${classes.card}`}>
      <Card.Body>
        <Card.Title>
          Reset your password
          {isResetting && (
            <Spinner
              style={{ marginLeft: "15px" }}
              animation="border"
              role="status"
              size="sm"
            />
          )}
        </Card.Title>
        <Form className="mb-3" onSubmit={formSubmitHandler}>
          <Form.Group controlId="password" className="mt-1">
            <Form.Label>New password</Form.Label>
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
          <Button variant="primary" type="submit">
            Reset password
          </Button>
        </Form>
        {resetError && (
          <p className="text-danger m-0" style={{ fontSize: "1.2rem" }}>
            An error occured while trying to reset your password
          </p>
        )}
        {!resetError && resetSuccess && (
          <p className="text-success m-0" style={{ fontSize: "1.2rem" }}>
            Passwod reset successful. You can login to your account using your
            new password now
          </p>
        )}
      </Card.Body>
    </Card>
  )
}

export default ResetPassword
