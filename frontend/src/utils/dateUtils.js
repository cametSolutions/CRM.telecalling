// dateUtils.js
import { parseISO, format } from "date-fns"

export const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  const date = parseISO(dateString)
  return format(date, "dd-MM-yyyy") // Format as "d-M-yyyy"
}
