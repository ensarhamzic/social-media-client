import React, { useState, useRef, useEffect } from "react"
import useAxios from "../hooks/use-axios"
import Card from "react-bootstrap/Card"
import Spinner from "react-bootstrap/Spinner"
import classes from "../pages/Login.module.css"
import { LinkContainer } from "react-router-bootstrap"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const ForgotPassword = () => {
  const { isLoading, error, sendRequest: forgotPassword } = useAxios()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [emailError, setEmailError] = useState(null)
  const [resetSuccess, setResetSuccess] = useState(false) // is password reset request successful
  const emailInputRef = useRef()

  const formSubmitHandler = (e) => {
    e.preventDefault()
    const email = emailInputRef.current.value
    const emailReg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!email.toLowerCase().match(emailReg))
      setEmailError("Must be in format of example@company.com")
    else setEmailError(null)

    setFormSubmitted(true)
  }

  useEffect(() => {
    const email = emailInputRef.current.value
    if (!emailError && formSubmitted) {
      ;(async () => {
        try {
          const response = await forgotPassword({
            url: "/users/forgot-password",
            method: "POST",
            data: { email },
            errorMessage: "An error occured. Check your email again",
          })
          if (!response.status) return
          setResetSuccess(true)
          emailInputRef.current.value = ""
        } catch {}
        setFormSubmitted(false)
      })()
      setFormSubmitted(false)
    }
  }, [emailError, formSubmitted, forgotPassword])

  return (
    <>
      <Card className={`mt-5 m-auto ${classes.card}`}>
        <Card.Body>
          <Card.Title>
            Forgot password
            {isLoading && (
              <Spinner animation="border" role="status" size="sm" />
            )}
          </Card.Title>
          <Form className="mb-3" onSubmit={formSubmitHandler}>
            <Form.Group controlId="password" className="mt-1 mb-4">
              <Form.Label>Your account email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                ref={emailInputRef}
              />
              {emailError && <p className="text-danger">{emailError}</p>}
            </Form.Group>
            <Button variant="primary" type="submit">
              Reset password
            </Button>
          </Form>
          {error && <p className="text-danger">{error}</p>}
          {!error && resetSuccess && (
            <p className="text-success" style={{ fontSize: "1.3rem" }}>
              Check your email to reset your password
            </p>
          )}
          <div className="mt-3">
            <div>
              <LinkContainer to="/login">
                <Card.Link>Know your credentials? Login here</Card.Link>
              </LinkContainer>
            </div>
            <div>
              <LinkContainer to="/register">
                <Card.Link>Don't have an account yet? Register here</Card.Link>
              </LinkContainer>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default ForgotPassword
