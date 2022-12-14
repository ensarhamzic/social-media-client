import React from "react"
import Card from "react-bootstrap/Card"
import Spinner from "react-bootstrap/Spinner"
import { useSelector } from "react-redux"
import UpdateUserForm from "../components/UpdateUserForm"
import useAxios from "../hooks/use-axios"
import { useNavigate } from "react-router-dom"
import { authActions } from "../store/auth-slice"
import { useDispatch } from "react-redux"
import classes from "./Login.module.css"

const EditProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, sendRequest: updateUser } = useAxios()
  const token = useSelector((state) => state.auth.token)

  const updateUserHandler = async (userData) => {
    const bodyFormData = new FormData()
    bodyFormData.append("FirstName", userData.firstName)
    bodyFormData.append("LastName", userData.lastName)
    bodyFormData.append("Email", userData.email)
    bodyFormData.append("Username", userData.username)
    bodyFormData.append("Password", userData.password)
    bodyFormData.append("DeleteProfilePicture", userData.deletePicture)
    bodyFormData.append("ProfilePicture", userData.profilePicture)
    try {
      const response = await updateUser({
        url: "/users",
        method: "PUT",
        data: bodyFormData,
        contentType: "multipart/form-data",
        token,
      })
      const { token: userToken, user } = response.data

      if (userToken) {
        dispatch(authActions.login({ token: userToken, user }))
        navigate("/profile")
      } else {
        dispatch(authActions.logout())
        navigate("/login", { replace: true })
      }
    } catch {}
  }

  return (
    <Card className={`mt-5 m-auto ${classes.card}`}>
      <Card.Body>
        <Card.Title>
          Update your profile details
          {isLoading && (
            <Spinner
              animation="border"
              role="status"
              size="sm"
              style={{ marginLeft: "15px" }}
            />
          )}
        </Card.Title>
        <UpdateUserForm onFormSubmit={updateUserHandler} updateError={error} />
      </Card.Body>
    </Card>
  )
}

export default EditProfile
