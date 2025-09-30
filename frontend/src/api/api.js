import axios from "axios"
let baseURL
const ENV = import.meta.env.VITE_NODE_ENV
if (ENV === "production") {
  baseURL = "https://www.crm.camet.in/api"

} else if (ENV === "development") {
  baseURL = "http://localhost:9000/api"
} else if (ENV === "testing") {
  baseURL = "https://www.crmtest.camet.in/api"
}


const api = axios.create({
  baseURL,
  withCredentials: true,

})
export default api
