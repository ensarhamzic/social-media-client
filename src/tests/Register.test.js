import { render, screen } from "@testing-library/react"
import Register from "../pages/Register"
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

describe("Register tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {})
  })
  test("renders learn react link", () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    )
    const linkElement = screen.getByText(/register as new user/i)
    expect(linkElement).toBeInTheDocument()
  })

  test("password validation", () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    )
    const submitBtn = screen.getByRole("button", { name: /register/i })
    userEvent.click(submitBtn)

    const validationError = screen.queryByText(
      /must be at least 8 characters long/i
    )
    expect(validationError).toBeInTheDocument()
  })

  test("required fields validation", () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    )
    const submitBtn = screen.getByRole("button", { name: /register/i })
    userEvent.click(submitBtn)

    const validationError = screen.queryAllByText(/must not be empty/i)
    expect(validationError).toHaveLength(3)
  })

  test("email field validation", () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    )
    const submitBtn = screen.getByRole("button", { name: /register/i })
    userEvent.click(submitBtn)

    const validationError = screen.queryByText(/Must be in format/i)
    expect(validationError).toBeInTheDocument()
  })
})
