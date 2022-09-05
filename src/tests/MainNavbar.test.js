import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import "@testing-library/jest-dom"
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../store/auth-slice"
import MainNavbar from "../components/MainNavbar"

jest.mock("react-router-dom", () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual("react-router-dom")

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
  }
})

describe("main navigation test", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {})
  })
  test("links when user is NOT authenticated", () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
    render(
      <Provider store={store}>
        <MainNavbar />
      </Provider>
    )

    const loginLink = screen.queryByText(/login/i)
    const regLink = screen.queryByText(/register/i)

    const homeLink = screen.queryByText(/home/i)
    const profileLink = screen.queryByText(/profile/i)

    const adminLink = screen.queryByText(/admin/i)

    expect(loginLink).toBeInTheDocument()
    expect(regLink).toBeInTheDocument()
    expect(homeLink).not.toBeInTheDocument()
    expect(profileLink).not.toBeInTheDocument()
    expect(adminLink).not.toBeInTheDocument()
  })

  test("links when user is authenticated", () => {
    const preloadedState = {
      auth: {
        isAuth: true,
        user: {
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
    render(
      <Provider store={store}>
        <MainNavbar />
      </Provider>
    )

    const homeLink = screen.queryByText(/home/i)
    const profileLink = screen.queryByText(/profile/i)
    const loginLink = screen.queryByText(/login/i)
    const regLink = screen.queryByText(/register/i)
    const adminLink = screen.queryByText(/admin/i)

    expect(homeLink).toBeInTheDocument()
    expect(profileLink).toBeInTheDocument()
    expect(loginLink).not.toBeInTheDocument()
    expect(regLink).not.toBeInTheDocument()
    expect(adminLink).not.toBeInTheDocument()
  })

  test("links when user is admin", () => {
    const preloadedState = {
      auth: {
        isAuth: true,
        user: {
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
    render(
      <Provider store={store}>
        <MainNavbar />
      </Provider>
    )

    const homeLink = screen.queryByText(/home/i)
    const profileLink = screen.queryByText(/profile/i)
    const loginLink = screen.queryByText(/login/i)
    const regLink = screen.queryByText(/register/i)
    const adminLink = screen.queryByText(/admin/i)

    expect(adminLink).toBeInTheDocument()
    expect(homeLink).not.toBeInTheDocument()
    expect(profileLink).not.toBeInTheDocument()
    expect(loginLink).not.toBeInTheDocument()
    expect(regLink).not.toBeInTheDocument()
  })
})
