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

const API_URL = process.env.REACT_APP_API_URL

const Chat = () => {
  const dispatch = useDispatch()
  const [opened, setOpened] = useState(false)
  const [connection, setConnection] = useState(null)
  const [chattingUser, setChattingUser] = useState(null)
  const { isLoading: messagesLoading, sendRequest: getMessages } = useAxios()
  const token = useSelector((state) => state.auth.token)
  const isAuth = useSelector((state) => state.auth.isAuth)

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
    const response = await getMessages({
      url: `/messages/${user.id}`,
      method: "GET",
      token,
    })

    if (!response.status) return

    setChattingUser({ ...user, messages: response.data })
  }

  console.log(chattingUser)

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
      </Card.Body>
    </Card>
  )
}

export default Chat
