import axios from "axios"
let baseURL
const ENV = import.meta.env.VITE_NODE_ENV
console.log("Ecbv",ENV)
if (ENV === "development") {
  baseURL = "http://localhost:9000/api"
} else if (ENV === "production") {
  baseURL = "https://crm.camet.in/api"
} else if (ENV === "testing") {
  baseURL = "https://crmtest.camet.in/api"
}
const api = axios.create({
  baseURL,
  withCredentials: true,

})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
