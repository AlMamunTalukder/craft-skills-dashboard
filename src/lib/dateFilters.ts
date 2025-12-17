// utils/dateFilters.ts
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

// Helper function to get date from item
const getDateFromItem = (item: any, dateField: string = "createdAt"): dayjs.Dayjs | null => {
  const dateValue = item[dateField];
  if (!dateValue) return null;
  
  const date = dayjs(dateValue);
  return date.isValid() ? date : null;
};

export const filterByToday = (data: any[], dateField: string = "createdAt"): any[] => {
  const today = dayjs().startOf("day");
  return data.filter((item) => {
    const itemDate = getDateFromItem(item, dateField);
    return itemDate?.isSame(today, "day");
  });
};

export const filterByYesterday = (data: any[], dateField: string = "createdAt"): any[] => {
  const yesterday = dayjs().subtract(1, "day").startOf("day");
  return data.filter((item) => {
    const itemDate = getDateFromItem(item, dateField);
    return itemDate?.isSame(yesterday, "day");
  });
};

export const filterByLast7Days = (data: any[], dateField: string = "createdAt"): any[] => {
  const last7Days = dayjs().subtract(7, "day").startOf("day");
  return data.filter((item) => {
    const itemDate = getDateFromItem(item, dateField);
    return itemDate?.isAfter(last7Days);
  });
};

export const filterByThisMonth = (data: any[], dateField: string = "createdAt"): any[] => {
  const startOfMonth = dayjs().startOf("month");
  return data.filter((item) => {
    const itemDate = getDateFromItem(item, dateField);
    return itemDate?.isAfter(startOfMonth);
  });
};

export const filterByThisYear = (data: any[], dateField: string = "createdAt"): any[] => {
  const startOfYear = dayjs().startOf("year");
  return data.filter((item) => {
    const itemDate = getDateFromItem(item, dateField);
    return itemDate?.isAfter(startOfYear);
  });
};

export const filterByDateRange = (
  data: any[],
  startDate: string | Date,
  endDate: string | Date,
  dateField: string = "createdAt"
): any[] => {
  const start = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).endOf("day");
  
  return data.filter((item) => {
    const itemDate = getDateFromItem(item, dateField);
    return itemDate?.isBetween(start, end, null, "[]");
  });
};