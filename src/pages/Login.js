import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card } from "react-bootstrap"
import { authActions } from "../store/auth-slice"
import LoginForm from "../components/LoginForm"
import { LinkContainer } from "react-router-bootstrap"
import useAxios from "../hooks/use-axios"
import Spinner from "react-bootstrap/Spinner"
import classes from "./Login.module.css"

const Login = () => {
  const { isLoading, error, sendRequest: login } = useAxios()

  const token = useSelector((state) => state.auth.token)

  const dispatch = useDispatch()
  const loginUserHandler = async (user) => {
    const response = await login({
      url: "/users/login",
      method: "POST",
      data: user,
      token,
    })
    if (response) {
      const { token, user: userData } = response.data
      dispatch(authActions.login({ token, user: userData }))
    }
  }

  return (
    <Card className={`mt-5 m-auto ${classes.card}`}>
      <Card.Body>
        <Card.Title>
          Login to your account{" "}
          {isLoading && <Spinner animation="border" role="status" size="sm" />}
        </Card.Title>
        <LoginForm onFormSubmit={loginUserHandler} loginError={error} />
        <div className="mt-3">
          <div>
            <LinkContainer to="/forgot-password">
              <Card.Link href="#">Forgot password?</Card.Link>
            </LinkContainer>
          </div>
          <div>
            <LinkContainer to="/register">
              <Card.Link href="#">
                Don't have an account yet? Register here
              </Card.Link>
            </LinkContainer>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Login
