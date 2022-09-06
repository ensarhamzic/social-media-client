import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import MainModal from "../components/MainModal"
import React from "react"

describe("modal test", () => {
  test("modal rendering", () => {
    render(<MainModal show={true} />)
    const followersEl = screen.queryByText(/close/i)
    expect(followersEl).toBeInTheDocument()
  })

  test("modal closing", () => {
    render(<MainModal show={false} />)
    const followersEl = screen.queryByText(/close/i)
    expect(followersEl).not.toBeInTheDocument()
  })

  test("modal title showing", () => {
    render(<MainModal show={false} title={"modal test"} />)
    const followersEl = screen.queryByText(/modal test/i)
    expect(followersEl).not.toBeInTheDocument()
  })
})
