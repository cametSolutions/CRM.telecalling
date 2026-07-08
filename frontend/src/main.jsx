import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { store } from "../app/store"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./tailwind.css"
import Layout from "./layouts/Layout"
// import { UnsavedChangesProvider } from "./context/UnsavedChangesContext"
import { UnsavedChangesProvider } from "./context/UnsavedChangesContext"
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
  <UnsavedChangesProvider> <Layout /></UnsavedChangesProvider>
       
      </QueryClientProvider>
    </Provider>
    <ToastContainer
      theme="dark"
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      pauseOnFocusLoss
      newestOnTop
      rtl={false}
      icon
    />
  </BrowserRouter>
)
