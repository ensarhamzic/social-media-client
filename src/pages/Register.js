import Card from "react-bootstrap/Card";
import RegisterForm from "../components/RegisterForm";
import axios from "axios";
import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const Register = () => {
  const [registerError, setRegisterError] = useState(null);
  const registerUserHandler = async (user) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, user);
      console.log(response.data);
      setRegisterError(null);
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
