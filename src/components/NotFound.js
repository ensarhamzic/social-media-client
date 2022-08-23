import React from "react"

const NotFound = () => {
  return (
    <div style={{ height: "80vh", position: "relative" }}>
      <div
        className="text-muted text-center"
        style={{
          margin: "0",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1>Error 404</h1>
        <h3>This page does not exist</h3>
      </div>
    </div>
  )
}

export default NotFound
