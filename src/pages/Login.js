import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card } from "react-bootstrap"
import { authActions } from "../store/auth-slice"
import LoginForm from "../components/LoginForm"
import { LinkContainer } from "react-router-bootstrap"
import useAxios from "../hooks/use-axios"
import Spinner from "react-bootstrap/Spinner"

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
    <Card className="mt-5 m-auto" style={{ width: "40%" }}>
      <Card.Body>
        <Card.Title>
          Login to your account{" "}
          {isLoading && <Spinner animation="border" role="status" size="sm" />}
        </Card.Title>
        <LoginForm onFormSubmit={loginUserHandler} loginError={error} />
        <LinkContainer to="/register">
          <Card.Link>Don't have an account yet? Register here</Card.Link>
        </LinkContainer>
      </Card.Body>
    </Card>
  )
}

export default Login
