import React, { useState, useEffect } from "react"
import { BsFillChatTextFill } from "react-icons/bs"
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai"
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { TbSearchOff } from "react-icons/tb"
import Card from "react-bootstrap/Card"
import classes from "./Chat.module.css"
import SearchUsers from "./SearchUsers"
import useAxios from "../hooks/use-axios"
import { useSelector, useDispatch } from "react-redux"
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import Messages from "./Messages"
import Spinner from "react-bootstrap/Spinner"
import { Form } from "react-bootstrap"
import UsersList from "./UsersList"

const API_URL = process.env.REACT_APP_API_URL

const Chat = () => {
  const dispatch = useDispatch()
  const [opened, setOpened] = useState(false)
  const [connection, setConnection] = useState(null)
  const [chatUsers, setChatUsers] = useState(null)
  const [chattingUser, setChattingUser] = useState(null)
  const [search, setSearch] = useState(false)
  const { isLoading: messagesLoading, sendRequest: getMessages } = useAxios()
  const { sendRequest: getChats } = useAxios()
  const token = useSelector((state) => state.auth.token)
  const isAuth = useSelector((state) => state.auth.isAuth)
  const authUserId = useSelector((state) => state.auth.user.id)

  const [newMessage, setNewMessage] = useState("")

  const newMessageSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    await connection.invoke("SendMessage", {
      message: newMessage,
      to: chattingUser.id,
    })

    setNewMessage("")
  }

  useEffect(() => {
    if (connection) return
    ;(async () => {
      if (isAuth) {
        try {
          const con = new HubConnectionBuilder()
            .withUrl(`${API_URL}/hubs/chat`, {
              accessTokenFactory: () => token,
            })
            .configureLogging(LogLevel.Information)
            .build()

          await con.start()
          await con.invoke("JoinChat")

          setConnection(con)
        } catch (error) {
          console.log(error)
        }
      }
    })()
  }, [isAuth, token, dispatch, connection])

  useEffect(() => {
    ;(async () => {
      const response = await getChats({
        url: "/messages/chats",
        method: "GET",
        token,
      })

      if (!response) return

      setChatUsers(response.data)
    })()
  }, [getChats, token])

  useEffect(() => {
    if (!connection) return

    connection.off("ReceiveMessage")

    connection.on("ReceiveMessage", (user, message) => {
      if (
        (message.fromUserId === authUserId &&
          message.toUserId === chattingUser?.id) ||
        (message.fromUserId === chattingUser?.id &&
          message.toUserId === authUserId)
      ) {
        if (chattingUser.messages.some((m) => m.id === message.id)) return
        const newMessages = [...chattingUser.messages]
        newMessages.push(message)
        setChattingUser((prevUser) => {
          return { ...prevUser, messages: newMessages }
        })
      } else if (chatUsers.some((u) => u.id === user.id)) {
      } else {
        setChatUsers((prevUsers) => [...prevUsers, user])
      }
    })
  }, [authUserId, chattingUser, connection, chatUsers])

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
            <div>
              {!search && (
                <AiOutlineSearch
                  onClick={() => {
                    setSearch(true)
                  }}
                />
              )}
              {search && (
                <TbSearchOff
                  onClick={() => {
                    setSearch(false)
                  }}
                />
              )}
              <AiOutlineCloseCircle
                onClick={() => {
                  setOpened(false)
                }}
              />
            </div>
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
      <Card.Body className={classes.cardBody}>
        {!chattingUser && search && (
          <div className={classes.searchResults}>
            <SearchUsers chatMode={true} onProfileClick={profileClickHandler} />
            <hr />
          </div>
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

        {!chattingUser && chatUsers && !search && (
          <div className={classes.recent}>
            <p>
              {chatUsers && chatUsers.length > 0
                ? "Recent Chats"
                : "No recent chats"}
            </p>
            <UsersList
              users={chatUsers}
              chatMode={true}
              onProfileClick={profileClickHandler}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default Chat
