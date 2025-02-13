// datetimeUtils.js

/**
 * Converts a date string (YYYY-MM-DD) to a human-readable date.
 * Example: "2025-01-30" -> "January 30, 2025"
 */
export function getReadableDate(dateString) {
    if (!dateString || typeof dateString !== "string") {
      return "Invalid date";
    }
  
    const [year, month, day] = dateString.split("-");
    if (!year || !month || !day) {
      return "Invalid date";
    }
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  }
  
  /**
   * Converts a time string (HH:mm:ss) to a human-readable time.
   * Example: "14:53:00" -> "2:53 PM"
   */
  export function getReadableTime(timeString) {
    if (!timeString || typeof timeString !== "string") {
      return "Invalid time";
    }
  
    let [hour, minute] = timeString.split(":");
    if (!hour || !minute) {
      return "Invalid time";
    }
  
    const isPM = hour >= 12;
    hour = hour % 12 || 12; // Convert to 12-hour format
    const meridiem = isPM ? "PM" : "AM";
  
    return `${hour}:${minute} ${meridiem}`;
  }
  