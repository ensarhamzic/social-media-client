import React, { useState, useEffect } from "react"
import { BsFillChatTextFill } from "react-icons/bs"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import Card from "react-bootstrap/Card"
import classes from "./Chat.module.css"
import SearchUsers from "./SearchUsers"
import useAxios from "../hooks/use-axios"
import { useSelector, useDispatch } from "react-redux"
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import Messages from "./Messages"
import Spinner from "react-bootstrap/Spinner"
import { Form } from "react-bootstrap"

const API_URL = process.env.REACT_APP_API_URL

const Chat = () => {
  const dispatch = useDispatch()
  const [opened, setOpened] = useState(false)
  const [connection, setConnection] = useState(null)
  const [chattingUser, setChattingUser] = useState(null)
  const { isLoading: messagesLoading, sendRequest: getMessages } = useAxios()
  const token = useSelector((state) => state.auth.token)
  const isAuth = useSelector((state) => state.auth.isAuth)

  const [newMessage, setNewMessage] = useState("")

  const newMessageSubmit = async (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    ;(async () => {
      if (isAuth) {
        try {
          const connection = new HubConnectionBuilder()
            .withUrl(`${API_URL}/hubs/chat`, {
              accessTokenFactory: () => token,
            })
            .configureLogging(LogLevel.Information)
            .build()

          connection.on("ReceiveMessage", (userId, message) => {
            console.log(userId, message)
          })

          await connection.start()
          await connection.invoke("JoinChat")

          setConnection(connection)
        } catch (error) {
          console.log(error)
        }
      }
    })()
  }, [isAuth, token, dispatch])

  if (!opened)
    return (
      <div
        className={classes.closedWrapper}
        onClick={() => {
          setOpened(true)
        }}
      >
        <BsFillChatTextFill />
      </div>
    )

  const profileClickHandler = async (user) => {
    setChattingUser({ ...user, messages: [] })
    const response = await getMessages({
      url: `/messages/${user.id}`,
      method: "GET",
      token,
    })

    if (!response.status) return

    setChattingUser((prevUser) => {
      return { ...prevUser, messages: response.data }
    })
  }

  return (
    <Card className={`mt-5 mb-5 m-auto ${classes.card}`}>
      <Card.Header className={classes.header}>
        {!chattingUser && (
          <>
            <div>Chat</div>
            <AiOutlineCloseCircle
              onClick={() => {
                setOpened(false)
              }}
            />
          </>
        )}
        {chattingUser && (
          <>
            <MdOutlineArrowBackIosNew
              onClick={() => {
                setChattingUser(null)
              }}
            />
            <div>{chattingUser.username}</div>
          </>
        )}
      </Card.Header>
      <Card.Body>
        {!chattingUser && (
          <SearchUsers chatMode={true} onProfileClick={profileClickHandler} />
        )}
        {chattingUser && (
          <>
            {messagesLoading && (
              <div className={classes.spinner}>
                <Spinner animation="border" role="status" />
              </div>
            )}
            {!messagesLoading && (
              <div className={classes.chattingWrapper}>
                <Messages messages={chattingUser.messages} />
                <Form onSubmit={newMessageSubmit}>
                  <Form.Control
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value)
                    }}
                    placeholder="Type message"
                  />
                </Form>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default Chat
