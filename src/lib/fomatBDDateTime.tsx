export const formatBDDateTime = (dateStr?: string) => {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "invalid";

  const day = date.toLocaleDateString("en-BD", {
    day: "2-digit",
    timeZone: "Asia/Dhaka",
  });

  const month = date.toLocaleDateString("en-BD", {
    month: "short",
    timeZone: "Asia/Dhaka",
  });

  const year = date.toLocaleDateString("en-BD", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  return {
    date: `${day}-${month}-${year}`,
    dayName: date.toLocaleDateString("en-BD", {
      weekday: "long",
      timeZone: "Asia/Dhaka",
    }),
    time: date.toLocaleTimeString("en-BD", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    }),
  };
};
