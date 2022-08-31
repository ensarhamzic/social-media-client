import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useAxios from "../hooks/use-axios"
import Card from "react-bootstrap/Card"
import Spinner from "react-bootstrap/Spinner"
import classes from "./Login.module.css"

const VerifyAccount = ({ cancelRedirect }) => {
  const params = useParams()
  const confirmToken = params.confirmToken
  const [accountVerified, setAccountVerified] = useState(false)

  const {
    isLoading: isVerifying,
    error: verifyError,
    sendRequest: verifyAccount,
  } = useAxios()

  useEffect(() => {
    ;(async () => {
      const response = await verifyAccount({
        url: `/users/confirm-account`,
        method: "POST",
        data: { confirmToken },
      })
      if (!response.status) return
      setAccountVerified(true)
    })()
  }, [confirmToken, verifyAccount])

  useEffect(() => {
    cancelRedirect()
  }, [cancelRedirect])

  return (
    <Card className={`mt-5 m-auto ${classes.card}`}>
      <Card.Body>
        <Card.Title>
          Verifying your account
          {isVerifying && (
            <Spinner
              style={{ marginLeft: "15px" }}
              animation="border"
              role="status"
              size="sm"
            />
          )}
        </Card.Title>
        {!accountVerified && !verifyError && (
          <h3>Attempting to verify your account</h3>
        )}
        {accountVerified && (
          <div className="text-success">
            <h3>Your account is successfully verified!</h3>
            <p>You can login to your account now!</p>
          </div>
        )}
        {verifyError && (
          <p className="text-danger" style={{ fontSize: "1.2rem" }}>
            An error occured while trying to verify your account
          </p>
        )}
      </Card.Body>
    </Card>
  )
}

export default VerifyAccount
