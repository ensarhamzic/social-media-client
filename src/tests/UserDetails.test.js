import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import "@testing-library/jest-dom"
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../store/auth-slice"
import UserDetails from "../components/UserDetails"
import React from "react"
import userEvent from "@testing-library/user-event"

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

describe("user details test", () => {
  test("details rendering", () => {
    const preloadedState = {
      auth: {
        token: "",
        isAuth: true,
        user: {
          id: 1,
          username: "test",
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
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
      id: 1,
      username: "test",
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      role: "User",
      followers: [],
      following: [],
    }

    render(
      <Provider store={store}>
        <UserDetails user={user} />
      </Provider>
    )

    const followersEl = screen.queryByText(/followers/i)
    expect(followersEl).toBeInTheDocument()
  })

  test("followers rendering", () => {
    const preloadedState = {
      auth: {
        token: "",
        isAuth: true,
        user: {
          id: 1,
          username: "test",
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
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
      id: 1,
      username: "test",
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      role: "User",
      followers: [],
      following: [],
    }

    render(
      <Provider store={store}>
        <UserDetails user={user} />
      </Provider>
    )

    const followersEl = screen.queryByText(/followers/i)
    userEvent.click(followersEl)
    const modalEl = screen.queryByText(/no users/i)
    expect(modalEl).toBeInTheDocument()
  })

  test("following rendering", () => {
    const preloadedState = {
      auth: {
        token: "",
        isAuth: true,
        user: {
          id: 1,
          username: "test",
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
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
      id: 1,
      username: "test",
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      role: "User",
      followers: [],
      following: [],
    }

    render(
      <Provider store={store}>
        <UserDetails user={user} />
      </Provider>
    )

    const followersEl = screen.queryByText(/following/i)
    userEvent.click(followersEl)
    const modalEl = screen.queryByText(/no users/i)
    expect(modalEl).toBeInTheDocument()
  })

  test("User edit profile button rendering", () => {
    const preloadedState = {
      auth: {
        token: "",
        isAuth: true,
        user: {
          id: 1,
          username: "test",
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
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
      id: 1,
      username: "test",
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      role: "User",
      followers: [],
      following: [],
    }

    render(
      <Provider store={store}>
        <UserDetails user={user} />
      </Provider>
    )

    const editProfileBtn = screen.queryByText(/edit profile/i)
    const deleteBtn = screen.queryByText(/delete profile/i)
    expect(editProfileBtn).toBeInTheDocument()
    expect(deleteBtn).not.toBeInTheDocument()
  })

  test("User edit profile button not render when not his profile", () => {
    const preloadedState = {
      auth: {
        token: "",
        isAuth: true,
        user: {
          id: 1,
          username: "test",
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
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
      id: 2,
      username: "test",
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      role: "User",
      followers: [],
      following: [],
    }

    render(
      <Provider store={store}>
        <UserDetails user={user} />
      </Provider>
    )

    const editProfileBtn = screen.queryByText(/edit profile/i)
    expect(editProfileBtn).not.toBeInTheDocument()
  })

  test("Admin delete profile button rendering", () => {
    const preloadedState = {
      auth: {
        token: "",
        isAuth: true,
        user: {
          id: 2,
          username: "test",
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          role: "Admin",
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
      id: 1,
      username: "test",
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      role: "User",
      followers: [],
      following: [],
    }

    render(
      <Provider store={store}>
        <UserDetails user={user} />
      </Provider>
    )

    const deleteBtn = screen.queryByText(/delete profile/i)
    const editProfileBtn = screen.queryByText(/edit profile/i)
    expect(deleteBtn).toBeInTheDocument()
    expect(editProfileBtn).not.toBeInTheDocument()
  })
})
