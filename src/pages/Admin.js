import React from "react"
import Card from "react-bootstrap/Card"
import SearchUsers from "../components/SearchUsers"
import classes from "./Admin.module.css"

const Admin = () => {
  return (
    <>
      <Card className={`mt-5 mb-5 m-auto ${classes.card}`}>
        <Card.Body>
          <h1 className="text-center">Admin panel</h1>
        </Card.Body>
      </Card>
      <Card className={`mt-5 mb-5 m-auto ${classes.card}`}>
        <Card.Header style={{ fontSize: "2.2rem" }} className="text-center">
          Find Users
        </Card.Header>
        <Card.Body>
          <SearchUsers />
        </Card.Body>
      </Card>
    </>
  )
}

export default Admin
