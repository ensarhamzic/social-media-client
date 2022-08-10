import Card from "react-bootstrap/Card";
import RegisterForm from "../components/RegisterForm";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";

const API_URL = process.env.REACT_APP_API_URL;

const Register = () => {
  const dispatch = useDispatch();
  const [registerError, setRegisterError] = useState(null);
  const registerUserHandler = async (user) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, user);
      const { token } = response.data;
      setRegisterError(null);
      dispatch(authActions.login({ token }));
    } catch (error) {
      setRegisterError(error.response.data.message);
    }
  };
  return (
    <Card className="mt-5 m-auto" style={{ width: "40%" }}>
      <Card.Body>
        <Card.Title>Register as new user</Card.Title>
        <RegisterForm
          onFormSubmit={registerUserHandler}
          registerError={registerError}
        />
      </Card.Body>
    </Card>
  );
};

export default Register;
