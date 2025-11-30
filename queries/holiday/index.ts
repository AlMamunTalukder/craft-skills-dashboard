"use server";

import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { holidaySchema } from "@/schemas/holiday";
import { Holiday } from "@prisma/client";

export const getHolidays = async () => {
  try {
    const holidays = await db.holiday.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return holidays;
  } catch (error) {
    throw new Error("Failed to fetch holidays");
  }
};

export const getHolidayById = async (id: string) => {
  try {
    const holiday = await db.holiday.findUnique({
      where: { id },
    });
    return holiday;
  } catch (error) {
    throw new Error("Failed to fetch holiday");
  }
};

export const createHoliday = async (
  data: Omit<Holiday, "id" | "createdAt" | "updatedAt">,
) => {
  const parsedData = holidaySchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const holiday = await db.holiday.create({
      data,
    });
    return holiday;
  } catch (error) {
    throw new Error("Failed to create holiday");
  }
};

export const updateHoliday = async (
  id: string,
  data: Partial<Omit<Holiday, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const holiday = await db.holiday.update({
      where: { id },
      data,
    });
    return holiday;
  } catch (error) {
    throw new Error("Failed to update holiday");
  }
};

export const deleteHoliday = async (id: string) => {
  try {
    const holiday = await db.holiday.delete({
      where: { id },
    });
    return holiday;
  } catch (error) {
    throw new Error("Failed to delete holiday");
  }
};

export const toggleHolidayStatus = async (id: string) => {
  try {
    const holiday = await db.holiday.findUnique({
      where: { id },
    });

    if (!holiday) {
      throw new Error("Holiday not found");
    }

    const updatedHoliday = await db.holiday.update({
      where: { id },
      data: {
        isActive: !holiday.isActive,
      },
    });

    return updatedHoliday;
  } catch (error) {
    throw new Error("Failed to toggle holiday status");
  }
};
