import React, { useEffect, useState } from "react"
import useAxios from "../hooks/use-axios"
import { useSelector } from "react-redux/es/exports"
import Card from "react-bootstrap/Card"
import PostsList from "../components/PostsList"
import Spinner from "react-bootstrap/Spinner"
import SearchUsers from "../components/SearchUsers"
import classes from "./Home.module.css"

const Home = () => {
  const [posts, setPosts] = useState([])
  const token = useSelector((state) => state.auth.token)
  const authUser = useSelector((state) => state.auth.user)

  const {
    isLoading: feedLoading,
    error: feedError,
    sendRequest: getUserFeed,
  } = useAxios()

  const postLikeHandler = (postId) => {
    const newPost = { ...posts.find((p) => p.id === postId) }
    const foundUserIndex = newPost.likes.findIndex((l) => l.id === authUser.id)
    if (foundUserIndex > -1) newPost.likes.splice(foundUserIndex, 1)
    else newPost.likes.push(authUser)
    const newPosts = posts.map((p) => {
      if (p.id === postId) return newPost
      return { ...p }
    })
    setPosts(newPosts)
  }
  const commentSubmitHandler = (postId, newComment) => {
    const newPost = { ...posts.find((p) => p.id === postId) }
    newPost.comments.unshift(newComment)
    const newPosts = posts.map((p) => {
      if (p.id === postId) return newPost
      return { ...p }
    })
    setPosts(newPosts)
  }
  const commentDeleteHandler = (postId, commentId) => {
    const newPost = { ...posts.find((p) => p.id === postId) }
    newPost.comments = newPost.comments.filter((c) => c.id !== commentId)
    const newPosts = posts.map((p) => {
      if (p.id === postId) return newPost
      return { ...p }
    })
    setPosts(newPosts)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const response = await getUserFeed({
          url: "/users/feed",
          method: "GET",
          token,
          errorMessage: "Trouble loading feed",
        })
        if (!response.status) return
        let formattedPosts = response.data.map((p) => {
          const newLikes = p.likes.map((l) => {
            return { ...l.user }
          })
          const newComments = p.comments.sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
          })
          return { ...p, likes: newLikes, comments: newComments }
        })
        formattedPosts = formattedPosts.sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        })
        setPosts(formattedPosts)
      } catch {}
    })()
  }, [getUserFeed, token])

  return (
    <>
      <Card className={`mt-5 mb-5 m-auto ${classes.card}`}>
        <Card.Header style={{ fontSize: "2.2rem" }} className="text-center">
          Find Users
        </Card.Header>
        <Card.Body>
          <SearchUsers />
        </Card.Body>
      </Card>
      <Card className={`mt-5 mb-5 m-auto ${classes.card}`}>
        <Card.Header style={{ fontSize: "2.2rem" }} className="text-center">
          Your feed
        </Card.Header>
        <Card.Body>
          {!feedError && !feedLoading && (
            <PostsList
              posts={posts}
              onPostLike={postLikeHandler}
              onSubmitComment={commentSubmitHandler}
              onCommentDelete={commentDeleteHandler}
            />
          )}

          {feedLoading && (
            <div className="text-center mt-3">
              <Spinner animation="border" role="status" />
            </div>
          )}

          {feedError && (
            <p
              className="text-center text-muted"
              style={{ fontSize: "1.3rem" }}
            >
              {feedError}
            </p>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default Home
