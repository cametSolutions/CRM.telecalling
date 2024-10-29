import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true
  // baseURL:"https://www.erp.camet.in/"
})
export default api
