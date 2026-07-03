export const formatBDDateTime = (isoString?: string | null) => {
    if (!isoString) return null;

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "invalid";

    // ✅ Use Intl API with Asia/Dhaka timezone — always correct
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        weekday: "long",
    }).formatToParts(date);

    const get = (type: string) => parts.find(p => p.type === type)?.value ?? "";

    const day = get("day");
    const month = get("month");
    const year = get("year");
    const dayName = get("weekday");
    const hour = get("hour");
    const minute = get("minute");
    const dayPeriod = get("dayPeriod").toUpperCase(); 

    return {
        date: `${day} ${month} ${year}`,          
        dayName,                                    
        time: `${hour}:${minute} ${dayPeriod}`,    
    };
};