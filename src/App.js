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
import { modalActions } from "./store/modal-slice";
import MainModal from "./components/MainModal";
import ReactDOM from "react-dom";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const modal = useSelector((state) => state.modal);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const verifyToken = async (userToken) => {
      try {
        const response = await axios.post(
          `${API_URL}/users/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { user } = response.data;
        dispatch(authActions.login({ token, user }));
      } catch (error) {
        localStorage.removeItem("token");
      }
    };
    if (token) {
      verifyToken(token);
    }
  }, [dispatch]);

  const modalHideHandler = () => {
    dispatch(modalActions.hide());
  };
  return (
    <>
      {ReactDOM.createPortal(
        <MainModal
          show={modal.show}
          onHide={modalHideHandler}
          title={modal.title}
        >
          {modal.element}
        </MainModal>,
        document.getElementById("modal")
      )}
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
        </Routes>
      </Container>
    </>
  );
}

export default App;
