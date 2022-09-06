import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import DeleteProfileModal from "../components/DeleteProfileModal"
import React from "react"
import { Provider } from "react-redux"
import "@testing-library/jest-dom"
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../store/auth-slice"

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

describe("delete modal test", () => {
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

  test("modal rendering", () => {
    render(
      <Provider store={store}>
        <DeleteProfileModal show={true} />
      </Provider>
    )
    const textEl = screen.queryByText(/This action/i)
    expect(textEl).toBeInTheDocument()
  })

  test("modal closing", () => {
    render(
      <Provider store={store}>
        <DeleteProfileModal show={false} />
      </Provider>
    )
    const textEl = screen.queryByText(/This action/i)
    expect(textEl).not.toBeInTheDocument()
  })
})
