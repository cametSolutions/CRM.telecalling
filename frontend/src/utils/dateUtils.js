// dateUtils.js
import { parseISO, format } from "date-fns"

export const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  const dateObj = new Date(dateString);

  const date = dateObj.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  const time = dateObj.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
    hour12: true // ✅ Enables 12-hour format with AM/PM
  });

  return `${date} ${time}`; // Example: "03/02/2025 02:48:57 PM"
  // const date = parseISO(dateString)
  // return format(date, "dd-MM-yyyy") // Format as "d-M-yyyy"
}
