import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import UserDetails from "../components/UserDetails"
import useAxios from "../hooks/use-axios"
import Spinner from "react-bootstrap/Spinner"
import UserPosts from "../components/UserPosts"

const Profile = ({ forAuthUser }) => {
  let userId = useSelector((state) => state.auth.user.id)
  const authUser = useSelector((state) => state.auth.user)
  let { id: userIdParam } = useParams()
  if (!forAuthUser) userId = userIdParam

  const token = useSelector((state) => state.auth.token)
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)

  const {
    isLoading: userLoading,
    error: userError,
    sendRequest: getUser,
  } = useAxios()

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await getUser({
          url: `/users/${userId}/posts`,
          method: "GET",
          token,
        })
        if (!response.status) return
        const profileUser = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          pictureURL: response.data.pictureURL,
          followers: response.data.followers,
          following: response.data.following,
        }

        const formattedPosts = response.data.posts.map((p) => {
          const postUser = { ...profileUser }
          const newLikes = p.likes.map((l) => {
            return { ...l.user }
          })
          let newComments = p.comments.map((c) => {
            const comment = {
              id: c.id,
              text: c.text,
              date: c.date,
            }
            return {
              ...comment,
              user: {
                ...c.user,
              },
            }
          })
          newComments = newComments.sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
          })
          return {
            ...p,
            user: postUser,
            likes: newLikes,
            comments: newComments,
          }
        })

        setPosts(
          formattedPosts.sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
          })
        )
        setUser(profileUser)
      } catch {
        setPosts([])
      }
    }
    getPosts()
  }, [userId, token, authUser, getUser])

  const addPostHandler = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts])
  }

  const followUnfollowHandler = () => {
    const newFollowers = [...user.followers]
    const foundUserIndex = newFollowers.findIndex((f) => f.id === authUser.id)
    if (foundUserIndex > -1) newFollowers.splice(foundUserIndex, 1)
    else newFollowers.push({ ...authUser, accepted: false })
    setUser({ ...user, followers: newFollowers })
  }

  const pendingFollowerRemoveHandler = (userId) => {
    let newFollowers = [...user.followers]
    newFollowers = newFollowers.filter((f) => f.id !== userId)
    setUser({ ...user, followers: newFollowers })
  }

  const removedFollowerHandler = () => {
    const newFollowing = [...user.following]
    const foundUserIndex = newFollowing.findIndex((f) => f.id === authUser.id)
    if (foundUserIndex > -1) newFollowing.splice(foundUserIndex, 1)
    setUser({ ...user, following: newFollowing })
  }

  const followerAcceptHandler = (userId) => {
    let newFollowers = [...user.followers]
    newFollowers = newFollowers.map((f) => {
      if (f.id === userId) {
        return { ...f, accepted: true }
      } else {
        return { ...f }
      }
    })
    setUser({ ...user, followers: newFollowers })
  }

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

  const postDeleteHandler = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId))
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

  const commentDeleteHandler = async (postId, commentId) => {
    const newPost = { ...posts.find((p) => p.id === postId) }
    newPost.comments = newPost.comments.filter((c) => c.id !== commentId)
    const newPosts = posts.map((p) => {
      if (p.id === postId) return newPost
      return { ...p }
    })
    setPosts(newPosts)
  }

  const updatePostHandler = (postId, text) => {
    const newPost = { ...posts.find((p) => p.id === postId) }
    newPost.text = text
    const newPosts = posts.map((p) => {
      if (p.id === postId) return newPost
      return { ...p }
    })
    setPosts(newPosts)
  }

  return (
    <div>
      {userLoading && (
        <div style={{ margin: "auto", marginTop: "50px", width: "100px" }}>
          <Spinner animation="border" role="status" />
        </div>
      )}
      {userError && (
        <p className="text-center text-muted mt-5" style={{ fontSize: "2rem" }}>
          {userError}
        </p>
      )}
      {!userError && user && (
        <UserDetails
          user={user}
          onFollowUnfollow={followUnfollowHandler}
          onRemoveFollower={removedFollowerHandler}
          onFollowerAccept={followerAcceptHandler}
          onPendingFollowerRemove={pendingFollowerRemoveHandler}
        />
      )}
      {!userError && user && (
        <UserPosts
          user={user}
          posts={posts}
          onAddPost={addPostHandler}
          onPostLike={postLikeHandler}
          onPostDelete={postDeleteHandler}
          onSubmitComment={commentSubmitHandler}
          onCommentDelete={commentDeleteHandler}
          onUpdatePost={updatePostHandler}
        />
      )}
    </div>
  )
}

export default Profile
