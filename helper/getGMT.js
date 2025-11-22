// Store in custom format with different options
const getGMT = (format) => {
  const date = new Date(Date.now() + 6 * 60 * 60 * 1000);

  // Month names array
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract components for formatting
  const year = date.getUTCFullYear();
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();

  // Get ordinal suffix (only 1st, 2nd, 3rd are special, rest are th)
  const getOrdinalSuffix = (day) => {
    switch (day) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const ordinalSuffix = getOrdinalSuffix(day);
  const dayWithOrdinal = `${day}${ordinalSuffix}`;

  // If date only is requested
  if (format === "date") {
    // Output: "21th November 2025"
    return `${dayWithOrdinal} ${month} ${year}`;
  }

  // Get time components
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  // Convert to AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12 AM
  const hours12 = String(hours).padStart(2, "0");

  // If dateTime with seconds is requested
  if (format === "dateTime") {
    // Output: "8:30:40 PM, 21th November 2025"
    return `${hours12}:${minutes}:${seconds} ${ampm}, ${dayWithOrdinal} ${month} ${year}`;
  }

  // Default: date with time (without seconds)
  // Output: "8:30 PM, 21th November 2025"
  return `${hours12}:${minutes} ${ampm}, ${dayWithOrdinal} ${month} ${year}`;
};

/**
 * Get formatted GMT+6 date/time
 *
 * @param {string} format - Format option:
 *   - 'date'     → "21th November 2025"
 *   - 'dateTime' → "8:30:40 PM, 21th November 2025"
 *   - (no param) → "8:30 PM, 21th November 2025" (DEFAULT)
 *
 * @returns {string} Formatted date/time string
 *
 * @example
 * getGMT()                    // "8:30 PM, 21th November 2025"
 * getGMT('date')              // "21th November 2025"
 * getGMT('dateTime')          // "8:30:40 PM, 21th November 2025"
 */
module.exports = getGMT;
