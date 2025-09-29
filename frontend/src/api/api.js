import axios from "axios"
let baseURL
const ENV = import.meta.env.VITE_NODE_ENV
console.log(ENV)
if (ENV === "development") {
console.log('h')
  baseURL = "http://localhost:9000/api"
} else if (ENV === "production") {
  baseURL = "https://www.crm.camet.in/api"
} else if (ENV === "testing") {
  baseURL = "https://www.crmtest.camet.in/api"
}
console.log(baseURL)
const api = axios.create({
  baseURL,
  withCredentials: true,

})
export default api
