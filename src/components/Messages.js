import React from "react"
import Message from "./Message"
import classes from "./Messages.module.css"

const Messages = ({ messages, onNewMessage }) => {
  return (
    <>
      {messages.length === 0 && (
        <div className={classes.noMessages}>No messages</div>
      )}
      {messages.length > 0 && (
        <div className={`d-flex flex-column ${classes.messages}`}>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      )}
    </>
  )
}

export default Messages
