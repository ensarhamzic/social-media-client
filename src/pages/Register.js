import { useState } from "react"
import Card from "react-bootstrap/Card"
import RegisterForm from "../components/RegisterForm"
import { LinkContainer } from "react-router-bootstrap"
import useAxios from "../hooks/use-axios"
import Spinner from "react-bootstrap/Spinner"
import { useSelector } from "react-redux"
import classes from "./Login.module.css"

const Register = () => {
  const { isLoading, error, sendRequest: register } = useAxios()
  const [accountCreated, setAccountCreated] = useState(false)
  const token = useSelector((state) => state.auth.token)
  const registerUserHandler = async (user) => {
    const response = await register({
      url: "/users/register",
      method: "POST",
      data: user,
      token,
    })
    if (response) {
      setAccountCreated(true)
    }
  }
  return (
    <>
      {accountCreated && (
        <Card className={`mt-5 m-auto ${classes.card}`}>
          <Card.Body className="fw-bold" style={{ fontSize: "1.2rem" }}>
            <p>Account successfully created!</p>
            <p>Please check your email to confirm your account!</p>
          </Card.Body>
        </Card>
      )}
      <Card className={`mt-5 m-auto ${classes.card}`}>
        <Card.Body>
          <Card.Title>
            Register as new user{" "}
            {isLoading && (
              <Spinner animation="border" role="status" size="sm" />
            )}
          </Card.Title>
          <RegisterForm
            onFormSubmit={registerUserHandler}
            registerError={error}
            accountCreated={accountCreated}
          />
          <LinkContainer to="/login">
            <Card.Link>Already have an account? Login here</Card.Link>
          </LinkContainer>
        </Card.Body>
      </Card>
    </>
  )
}

export default Register
