import Card from "react-bootstrap/Card"
import RegisterForm from "../components/RegisterForm"
import { useDispatch } from "react-redux"
import { authActions } from "../store/auth-slice"
import { LinkContainer } from "react-router-bootstrap"
import useAxios from "../hooks/use-axios"
import Spinner from "react-bootstrap/Spinner"

const Register = () => {
  const { isLoading, error, sendRequest: register } = useAxios()
  const dispatch = useDispatch()
  const registerUserHandler = async (user) => {
    const response = await register({
      url: "/users/register",
      method: "POST",
      data: user,
      auth: false,
    })
    if (response) {
      const { token, user: newUserData } = response.data
      dispatch(authActions.login({ token, user: newUserData }))
    }
  }
  return (
    <Card className="mt-5 m-auto" style={{ width: "40%" }}>
      <Card.Body>
        <Card.Title>
          Register as new user{" "}
          {isLoading && <Spinner animation="border" role="status" size="sm" />}
        </Card.Title>
        <RegisterForm
          onFormSubmit={registerUserHandler}
          registerError={error}
        />
        <LinkContainer to="/login">
          <Card.Link>Already have an account? Login here</Card.Link>
        </LinkContainer>
      </Card.Body>
    </Card>
  )
}

export default Register
