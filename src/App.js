import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MainNavbar from "./components/MainNavbar";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import { useEffect } from "react";
import axios from "axios";
import { authActions } from "./store/auth-slice";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const verifyToken = async (userToken) => {
      try {
        await axios.post(
          `${API_URL}/users/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(authActions.login({ token }));
        console.log("a");
      } catch (error) {
        console.log("b");
        localStorage.removeItem("token");
      }
    };
    if (token) {
      verifyToken(token);
    }
  }, [dispatch]);
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
          {!isAuth && <Route path="/home" element={<Navigate to="/login" />} />}
          {isAuth && <Route path="/profile" element={<Profile />} />}
          {!isAuth && (
            <Route path="/profile" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Container>
    </>
  );
}

export default App;
