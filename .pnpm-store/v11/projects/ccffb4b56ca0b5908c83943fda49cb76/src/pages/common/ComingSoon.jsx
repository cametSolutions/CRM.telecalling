import React from "react"

const ComingSoon = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Coming Soon</h1>
      <p style={styles.message}>
        This page is under construction. Please check back later!
      </p>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    flexDirection: "column",
    backgroundColor: "#f0f0f0"
  },
  title: {
    fontSize: "3em",
    color: "#333",
    margin: 0
  },
  message: {
    fontSize: "1.2em",
    color: "#666",
    backgroundColor: "#ffdb4d",
    padding: "10px 20px",
    borderRadius: "5px"
  }
}

export default ComingSoon
