import React, { useEffect, useRef } from "react"
import Message from "./Message"
import classes from "./Messages.module.css"

const Messages = ({ messages, onNewMessage }) => {
  const messagesRef = useRef()

  useEffect(() => {
    if (messagesRef && messagesRef.current) {
      const { scrollHeight, clientHeight } = messagesRef.current
      messagesRef.current.scrollTo({
        left: 0,
        top: scrollHeight - clientHeight,
        behaviour: "smooth",
      })
    }
  }, [messages])

  return (
    <>
      {messages.length === 0 && (
        <div className={classes.noMessages}>No messages</div>
      )}
      {messages.length > 0 && (
        <div
          className={`d-flex flex-column ${classes.messages}`}
          ref={messagesRef}
        >
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      )}
    </>
  )
}

export default Messages
