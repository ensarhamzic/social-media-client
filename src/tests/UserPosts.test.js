import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import "@testing-library/jest-dom"
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../store/auth-slice"
import UserPosts from "../components/UserPosts"
import React from "react"

jest.mock("react-router-dom", () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual("react-router-dom")

  const wrapper = ({ children }) => {
    return children
  }

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: jest.fn(),
    useLocation: () => {
      return { pathname: "" }
    },
    useHref: jest.fn(),
    useNavigate: jest.fn(),
    useMatch: jest.fn(),
    Link: wrapper,
  }
})

describe("user posts test", () => {
  // beforeEach(() => {
  //   jest.spyOn(console, "error").mockImplementation(() => {})
  // })

  test("no posts render", () => {
    const preloadedState = {
      auth: {
        token: "",
        isAuth: true,
        user: {
          id: 1,
          role: "User",
        },
      },
    }

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState,
    })

    const user = {
      username: "ensar",
      id: 1,
    }

    render(
      <Provider store={store}>
        <UserPosts user={user} posts={[]} />
      </Provider>
    )

    const noPostsEl = screen.queryByText(/no posts/i)
    expect(noPostsEl).toBeInTheDocument()
  })

  test("posts render", () => {
    const preloadedState = {
      auth: {
        token: "",
        isAuth: true,
        user: {
          id: 1,
          role: "User",
        },
      },
    }

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState,
    })

    const user = {
      username: "ensar",
      id: 2,
    }

    const posts = [
      {
        id: 1,
        text: "test",
        userId: 1,
        user: {
          id: 1,
          username: "ensar",
          pictureURL: "",
        },
        comments: [],
        likes: [],
      },
      {
        id: 2,
        text: "test",
        userId: 1,
        user: {
          id: 1,
          username: "ensar",
          pictureURL: "",
        },
        comments: [],
        likes: [],
      },
    ]

    render(
      <Provider store={store}>
        <UserPosts user={user} posts={posts} />
      </Provider>
    )

    const noPostsEl = screen.queryAllByText(/like/i)
    expect(noPostsEl).not.toHaveLength(0)
  })
})
