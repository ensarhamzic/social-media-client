import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MainNavbar from "./components/MainNavbar";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth);
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
