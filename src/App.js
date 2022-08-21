import { Routes, Route, Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Login from "./pages/Login"
import Home from "./pages/Home"
import MainNavbar from "./components/MainNavbar"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import { useEffect } from "react"
import { authActions } from "./store/auth-slice"
import useAxios from "./hooks/use-axios"
import EditProfile from "./pages/EditProfile"

function App() {
  const dispatch = useDispatch()
  const { sendRequest: verifyToken } = useAxios()
  const isAuth = useSelector((state) => state.auth.isAuth)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      ;(async () => {
        try {
          const response = await verifyToken({
            url: "/users/verify",
            method: "POST",
            token,
          })

          if (response.status === 200) {
            const { user } = response.data
            dispatch(authActions.login({ token, user }))
          }
        } catch (error) {
          localStorage.removeItem("token")
        }
      })()
    }
  }, [dispatch, verifyToken])

  return (
    <>
      <MainNavbar />
      <Container>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuth ? "/home" : "/login"} />}
          />
          {!isAuth && <Route path="/login" element={<Login />} />}
          {isAuth && (
            <Route path="/login" element={<Navigate to="/profile" />} />
          )}
          {!isAuth && <Route path="/register" element={<Register />} />}
          {isAuth && (
            <Route path="/register" element={<Navigate to="/profile" />} />
          )}
          {isAuth && <Route path="/home" element={<Home />} />}
          {isAuth && (
            <Route path="/profile" element={<Profile forAuthUser={true} />} />
          )}
          {isAuth && (
            <Route
              path="/profile/:id"
              element={<Profile forAuthUser={false} />}
            />
          )}
          {isAuth && <Route path="/profile/edit" element={<EditProfile />} />}
        </Routes>
      </Container>
    </>
  )
}

export default App
