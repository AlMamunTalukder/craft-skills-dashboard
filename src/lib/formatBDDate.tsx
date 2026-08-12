const BD_TIMEZONE = "Asia/Dhaka";

const bdFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BD_TIMEZONE,
  year: "numeric",
  month: "short",
  day: "2-digit",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

type BDParts = {
  day: string;
  month: string;
  year: string;
  weekday: string;
  hour: string;
  minute: string;
  dayPeriod: string;
};

const toBDParts = (isoString: string): BDParts | null => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;

  const map: Record<string, string> = {};
  for (const part of bdFormatter.formatToParts(date)) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  return {
    day: map.day,
    month: map.month,
    year: map.year,
    weekday: map.weekday,
    hour: map.hour,
    minute: map.minute,
    dayPeriod: map.dayPeriod,
  };
};

export const formatBDDateTime = (isoString?: string | null) => {
  if (!isoString) return null;

  try {
    const parts = toBDParts(isoString);
    if (!parts) return "invalid";

    return {
      date: `${parts.day} ${parts.month} ${parts.year}`,
      dayName: parts.weekday,
      time: `${parts.hour}:${parts.minute} ${parts.dayPeriod}`,
      fullDateTime: `${parts.day} ${parts.month} ${parts.year} ${parts.hour}:${parts.minute} ${parts.dayPeriod}`,
    };
  } catch {
    return "invalid";
  }
};

// Format just the date
export const formatBDDate = (isoString?: string | null) => {
  if (!isoString) return null;
  try {
    const parts = toBDParts(isoString);
    if (!parts) return null;
    return `${parts.day} ${parts.month} ${parts.year}`;
  } catch {
    return null;
  }
};

// Format just the time
export const formatBDTime = (isoString?: string | null) => {
  if (!isoString) return null;
  try {
    const parts = toBDParts(isoString);
    if (!parts) return null;
    return `${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
  } catch {
    return null;
  }
};
