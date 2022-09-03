import React, { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "react-bootstrap"
import { authActions } from "../store/auth-slice"
import { useNavigate, useLocation } from "react-router-dom"
import classes from "./MainNavbar.module.css"

const MainNavbar = () => {
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const isAuth = useSelector((state) => state.auth.isAuth)
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.auth.user)

  const { pathname } = location
  useEffect(() => {
    setExpanded(false)
  }, [pathname])

  const logoutHandler = () => {
    dispatch(authActions.logout())
    navigate("/login", { replace: true })
  }

  let navLinks = (
    <>
      <LinkContainer to="/login">
        <Nav.Link>Login</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/register">
        <Nav.Link>Register</Nav.Link>
      </LinkContainer>
    </>
  )

  if (isAuth) {
    navLinks = (
      <>
        <LinkContainer to="/home">
          <Nav.Link>Home</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/profile">
          <Nav.Link>Profile</Nav.Link>
        </LinkContainer>
        <Button
          onClick={logoutHandler}
          variant="secondary"
          className={classes.button}
        >
          Logout
        </Button>
      </>
    )
  }

  if (authUser.role === "Admin") {
    navLinks = (
      <>
        <LinkContainer to="/admin">
          <Nav.Link>Admin</Nav.Link>
        </LinkContainer>
        <Button
          onClick={logoutHandler}
          variant="secondary"
          className={classes.button}
        >
          Logout
        </Button>
      </>
    )
  }

  const toggleHandler = () => {
    setExpanded((prevState) => !prevState)
  }
  return (
    <Navbar bg="light" expand="lg" expanded={expanded} onToggle={toggleHandler}>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Social Media App</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end" style={{ width: "100%" }}>
            {navLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MainNavbar
