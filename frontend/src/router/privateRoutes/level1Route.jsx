import { Navigate } from "react-router-dom"

function ProtectedSecRoute({ children }) {
  const UserData = JSON.parse(localStorage.getItem("user"))

  if (UserData == null) {
    // Use Navigate component within a returned JSX expression
    return <Navigate to={"/login"} />
  }

  return (
    <div>
      {/* Render the protected content */}
      {children}
    </div>
  )
}

export default ProtectedSecRoute
