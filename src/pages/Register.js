import { useState } from "react"
import Card from "react-bootstrap/Card"
import RegisterForm from "../components/RegisterForm"
import { LinkContainer } from "react-router-bootstrap"
import useAxios from "../hooks/use-axios"
import Spinner from "react-bootstrap/Spinner"
import { useSelector } from "react-redux"
import classes from "./Login.module.css"
import useModal from "../hooks/use-modal"
import MainModal from "../components/MainModal"

const Register = () => {
  const { isLoading, error, sendRequest: register } = useAxios()
  const [modalShowed, showModal, hideModal, title] = useModal()
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
      showModal("Account successfully created!")
    }
  }

  const hideModalHandler = () => {
    hideModal()
    setAccountCreated(false)
  }

  return (
    <>
      <MainModal show={modalShowed} onHide={hideModalHandler} title={title}>
        <h4>Please check your email to confirm your account!</h4>
      </MainModal>
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
          <div className="mt-3">
            <LinkContainer to="/login">
              <Card.Link>Already have an account? Login here</Card.Link>
            </LinkContainer>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default Register
