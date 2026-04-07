export const formatBDDateTime = (isoString?: string | null) => {
  if (!isoString) return null;

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "invalid";

  // Convert to Bangladesh time (UTC+6)
  const bdDate = new Date(date.getTime() + 6 * 60 * 60 * 1000);

  // Format date: 08 Apr 2026
  const day = String(bdDate.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[bdDate.getMonth()];
  const year = bdDate.getFullYear();
  const dateStr = `${day} ${month} ${year}`;

  // Format day name: Wednesday
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = dayNames[bdDate.getDay()];

  // Format 12-hour time: 09:00 PM
  let hours = bdDate.getHours();
  const minutes = String(bdDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 => 12
  const time = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

  return { date: dateStr, dayName, time };
};
