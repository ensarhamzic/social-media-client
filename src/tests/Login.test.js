import { render, screen } from "@testing-library/react"
import Login from "../pages/Login"
import { Provider } from "react-redux"
import store from "../store/index"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useHref: () => jest.fn(),
  useMatch: () => jest.fn(),
  useLocation: () => jest.fn(),
}))

describe("login tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {})
  })
  test("renders login page", () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    )
    const txtEl = screen.getByText(/login to your account/i)
    expect(txtEl).toBeInTheDocument()
  })

  test("username validation", () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    )
    const submitBtn = screen.getByRole("button", { name: /login/i })
    userEvent.click(submitBtn)

    const validationError = screen.queryByText(/must not be empty/i)
    expect(validationError).toBeInTheDocument()
  })

  test("password validation", () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    )
    const submitBtn = screen.getByRole("button", { name: /login/i })
    userEvent.click(submitBtn)

    const validationError = screen.queryByText(
      /must be at least 8 characters long/i
    )
    expect(validationError).toBeInTheDocument()
  })
})
