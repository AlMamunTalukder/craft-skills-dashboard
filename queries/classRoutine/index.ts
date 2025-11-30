"use server";

import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { classRoutineSchema } from "@/schemas/classRoutine";
import { ClassRoutine } from "@prisma/client";

export const getClassRoutines = async () => {
  try {
    const routines = await db.classRoutine.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return routines;
  } catch (error) {
    throw new Error("Failed to fetch class routines");
  }
};

export const getClassRoutineById = async (id: string) => {
  try {
    const routine = await db.classRoutine.findUnique({
      where: { id },
    });
    return routine;
  } catch (error) {
    throw new Error("Failed to fetch class routine");
  }
};

export const createClassRoutine = async (
  data: Omit<ClassRoutine, "id" | "createdAt" | "updatedAt">,
) => {
  const parsedData = classRoutineSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const routine = await db.classRoutine.create({
      data,
    });
    return routine;
  } catch (error) {
    throw new Error("Failed to create class routine");
  }
};

export const updateClassRoutine = async (
  id: string,
  data: Partial<Omit<ClassRoutine, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const routine = await db.classRoutine.update({
      where: { id },
      data,
    });
    return routine;
  } catch (error) {
    throw new Error("Failed to update class routine");
  }
};

export const deleteClassRoutine = async (id: string) => {
  try {
    const routine = await db.classRoutine.delete({
      where: { id },
    });
    return routine;
  } catch (error) {
    throw new Error("Failed to delete class routine");
  }
};

export const toggleClassRoutineStatus = async (id: string) => {
  try {
    const routine = await db.classRoutine.findUnique({
      where: { id },
    });

    if (!routine) {
      throw new Error("Class routine not found");
    }

    const updatedRoutine = await db.classRoutine.update({
      where: { id },
      data: {
        isActive: !routine.isActive,
      },
    });

    return updatedRoutine;
  } catch (error) {
    throw new Error("Failed to toggle class routine status");
  }
};
