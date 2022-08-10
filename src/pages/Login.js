import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card } from "react-bootstrap";
import { authActions } from "../store/auth-slice";
import LoginForm from "../components/LoginForm";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState(null);
  const loginUserHandler = async (user) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, user);
      const { token } = response.data;
      console.log(token);
      setLoginError(null);
      dispatch(authActions.login({ token }));
    } catch (error) {
      setLoginError(error.response.data.message);
    }
  };
  return (
    <Card className="mt-5 m-auto" style={{ width: "40%" }}>
      <Card.Body>
        <Card.Title>Login to your account</Card.Title>
        <LoginForm onFormSubmit={loginUserHandler} loginError={loginError} />
      </Card.Body>
    </Card>
  );
};

export default Login;
