"use server";

import { InstructorFormData } from "@/components/Forms/InstructorForm";
import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { instructorSchema } from "@/schemas/content/instructor";
import { revalidatePath } from "next/cache";

export const getAllInstructors = async () => {
  try {
    const instructors = await db.instructor.findMany({
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return instructors;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw new Error("Failed to fetch instructors.");
  }
};

export const getInstructorById = async (id: string) => {
  try {
    const instructor = await db.instructor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return instructor;
  } catch (error) {
    console.error("Error fetching instructor:", error);
    throw new Error("Failed to fetch instructor.");
  }
};

export const createInstructor = async (data: InstructorFormData) => {
  const parsedData = instructorSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const instructor = await db.instructor.create({
      data: parsedData.data,
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
      },
    });
    return instructor;
  } catch (error) {
    console.error("Error creating instructor:", error);
    throw new Error("Failed to create instructor.");
  }
};

export const updateInstructor = async ({
  data,
  id,
}: {
  data: InstructorFormData;
  id: string;
}) => {
  const parsedData = instructorSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const instructor = await db.instructor.update({
      where: { id },
      data: parsedData.data,
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
      },
    });
    return instructor;
  } catch (error) {
    console.error("Error updating instructor:", error);
    throw new Error("Failed to update instructor.");
  }
};

export const deleteInstructor = async (id: string) => {
  try {
    const instructor = await db.instructor.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
      },
    });
    revalidatePath("/", "layout");
    return instructor;
  } catch (error) {
    console.error("Error deleting instructor:", error);
    throw new Error("Failed to delete instructor.");
  }
};
