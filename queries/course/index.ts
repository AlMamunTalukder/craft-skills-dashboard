"use server";

import { CourseFormData } from "@/components/Forms/Course/CourseForm";
import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { courseSchema } from "@/schemas/course";
import { revalidatePath } from "next/cache";

export const createCourse = async (data: CourseFormData) => {
  const parsedData = courseSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const course = await db.course.create({
      data: {
        name: parsedData.data.name,
        description: parsedData.data.description as string,
        price: parsedData.data.price,
        discount: parsedData.data.discount as number,
        paymentCharge: parsedData.data.paymentCharge as number,
      },
    });

    revalidatePath("/", "layout");

    return course;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create seminar.",
    );
  }
};

export const updateCourse = async ({
  id,
  data,
}: {
  id: string;
  data: CourseFormData;
}) => {
  // Check if the course exists
  const existingCourse = await db.course.findUnique({ where: { id } });
  if (!existingCourse) {
    throw new Error("The course does not exist.");
  }

  const parsedData = courseSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const course = await db.course.update({
      where: { id },
      data: {
        name: parsedData.data.name,
        description: parsedData.data.description as string,
        price: parsedData.data.price,
        discount: parsedData.data.discount as number,
        paymentCharge: parsedData.data.paymentCharge as number,
      },
    });

    revalidatePath("/", "layout");
    return course;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update seminar.",
    );
  }
};

export const getCourses = async () => {
  try {
    const courses = await db.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    return courses;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch seminars.",
    );
  }
};

export const getCourseById = async (id: string) => {
  try {
    const course = await db.course.findUnique({
      where: { id },
    });
    return course;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch seminar.",
    );
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const course = await db.course.delete({
      where: { id },
    });
    return course;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete seminar.",
    );
  }
};
