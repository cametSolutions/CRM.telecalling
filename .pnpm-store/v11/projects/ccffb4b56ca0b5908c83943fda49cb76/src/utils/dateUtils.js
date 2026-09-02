// dateUtils.js
import { parseISO, format } from "date-fns"

export const formatDate = (dateString) => {
  if (!dateString) return "N/A"
console.log(dateString)
  
  const date = parseISO(dateString)
console.log(date)
  return format(date, "dd-MM-yyyy") // Format as "d-M-yyyy"
}
