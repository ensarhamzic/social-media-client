import React from "react"
import { useSelector } from "react-redux"
import classes from "./Message.module.css"

const Message = ({ message }) => {
  const authUserId = useSelector((state) => state.auth.user.id)

  return (
    <div
      className={`${classes.message} ${
        authUserId === message.fromUserId
          ? classes.sentMessage
          : classes.receivedMessage
      }`}
    >
      {message.text}
    </div>
  )
}

export default Message
