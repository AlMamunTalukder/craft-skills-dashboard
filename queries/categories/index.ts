"use server";
import { db } from "@/prisma/db";

export const getAllCategories = async () => {
  try {
    const categories = await db.studentCategory.findMany({
      orderBy: { createdAt: "desc" },
    });
    return categories;
  } catch (error) {
    throw new Error(
      `Failed to fetch categories: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

export const updateStudentCategory = async (
  studentId: string,
  categoryId: string,
) => {
  try {
    const updatedStudent = await db.student.update({
      where: { id: studentId },
      data: {
        studentCategoryId: categoryId,
      },
    });
    return updatedStudent;
  } catch (error) {
    throw new Error(
      `Failed to update student category: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};
