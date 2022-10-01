import { useState } from "react"
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import MainNavbar from "./components/MainNavbar"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import { useEffect } from "react"
import { authActions } from "./store/auth-slice"
import useAxios from "./hooks/use-axios"
import EditProfile from "./pages/EditProfile"
import NotFound from "./components/NotFound"
import Spinner from "react-bootstrap/Spinner"
import classes from "./App.module.css"
import VerifyAccount from "./pages/VerifyAccount"
import ResetPassword from "./components/ResetPassword"
import ForgotPassword from "./components/ForgotPassword"
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import Chat from "./components/Chat"

const API_URL = process.env.REACT_APP_API_URL

function App() {
  const [connection, setConnection] = useState(null)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [redirectPath, setRedirectPath] = useState(location.pathname)
  const [loggingIn, setLoggingIn] = useState(false)
  const { sendRequest: verifyToken } = useAxios()
  const isAuth = useSelector((state) => state.auth.isAuth)
  const authUser = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)

  const { pathname } = location
  useEffect(() => {
    if (isAuth && redirectPath && pathname && redirectPath !== pathname) {
      navigate(redirectPath, { replace: true })
      setRedirectPath(null)
    }
  }, [redirectPath, navigate, pathname, isAuth])

  const cancelRedirect = () => {
    if (redirectPath) {
      setRedirectPath(null)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      ;(async () => {
        setLoggingIn(true)
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
        } finally {
          setLoggingIn(false)
        }
      })()
    }
  }, [dispatch, verifyToken])

  useEffect(() => {
    ;(async () => {
      if (isAuth) {
        try {
          const connection = new HubConnectionBuilder()
            .withUrl(`${API_URL}/hubs/chat`, {
              accessTokenFactory: () => token,
            })
            .configureLogging(LogLevel.Information)
            .build()

          connection.on("ReceiveMessage", (userId, message) => {
            console.log(userId, message)
          })

          await connection.start()
          await connection.invoke("JoinChat")

          setConnection(connection)
        } catch (error) {
          console.log(error)
        }
      }
    })()
  }, [isAuth, token, dispatch])

  let routes = (
    <>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Navigate to="/login" />} />
      <Route path="/profile" element={<Navigate to="/login" />} />
      <Route path="/profile/:id" element={<Navigate to="/login" />} />
      <Route path="/profile/edit" element={<Navigate to="/login" />} />
    </>
  )

  if (isAuth) {
    routes = (
      <>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Navigate to="/profile" />} />
        <Route path="/register" element={<Navigate to="/profile" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile forAuthUser={true} />} />
        <Route path="/profile/:id" element={<Profile forAuthUser={false} />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </>
    )
  }

  if (authUser.role === "Admin") {
    routes = (
      <>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/login" element={<Navigate to="/admin" />} />
        <Route path="/register" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile/:id" element={<Profile forAuthUser={false} />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </>
    )
  }

  return (
    <>
      <MainNavbar />
      <Container>
        {!loggingIn && (
          <Routes>
            {routes}
            <Route
              path="/verify/:confirmToken"
              element={<VerifyAccount cancelRedirect={cancelRedirect} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:resetToken"
              element={<ResetPassword cancelRedirect={cancelRedirect} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
        {loggingIn && (
          <div className={classes.loggingInDiv}>
            <p>Logging you in...</p>
            <Spinner
              animation="border"
              role="status"
              className={classes.spinner}
            />
          </div>
        )}
      </Container>
      {isAuth && <Chat />}
    </>
  )
}

export default App
