
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { store } from "../app/store"
import { Provider } from "react-redux"
//import Header from "./header/Header"
//import { Provider } from "react-redux"
//import Router from "./router/Router"
//import '@fortawesome/fontawesome-free/css/all.min.css';

import "./tailwind.css"
import Layout from "./layouts/Layout"

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Provider store={store}>
        <Layout />
      </Provider>
    </BrowserRouter>
    <ToastContainer
      theme="dark"
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      pauseOnFocusLoss
      newestOnTop
      rtl={false}
      icon
    
    />
  </>
)
