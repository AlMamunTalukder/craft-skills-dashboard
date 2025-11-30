"use server";

import { TotalClassFormData } from "@/components/Forms/TotalClassForm";
import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { totalclassSchema } from "@/schemas/totalclass";
import { revalidatePath } from "next/cache";

export const getAllTotalClass = async () => {
  try {
    const totalclasses = await db.totalClass.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return totalclasses;
  } catch (error) {
    console.error("Error fetching total classes:", error);
    throw new Error("Failed to fetch total classes.");
  }
};

export const createTotalClass = async (data: TotalClassFormData) => {
  const parsedData = totalclassSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const totalclass = await db.totalClass.create({
      data: parsedData.data,
    });
    revalidatePath("/", "layout");

    return totalclass;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create total class.",
    );
  }
};

export const getTotalClassById = async (id: string) => {
  try {
    const totalclass = await db.totalClass.findUnique({
      where: { id },
    });
    return totalclass;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch total class.",
    );
  }
};

export const updateTotalClass = async ({
  id,
  data,
}: {
  id: string;
  data: TotalClassFormData;
}) => {
  const parsedData = totalclassSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    // Check if the total class exists
    const totalClassExists = await db.totalClass.findUnique({
      where: { id },
    });

    if (!totalClassExists) {
      throw new Error("The total class record does not exist.");
    }

    const totalclass = await db.totalClass.update({
      where: { id },
      data: parsedData.data,
    });
    revalidatePath("/", "layout");
    return totalclass;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update total class.",
    );
  }
};

export const deleteTotalClass = async (id: string) => {
  try {
    const totalclass = await db.totalClass.findUnique({
      where: { id },
    });

    if (!totalclass) {
      throw new Error("The total class record does not exist.");
    }

    const deletedTotalClass = await db.totalClass.delete({
      where: { id },
    });

    revalidatePath("/", "layout");
    return deletedTotalClass;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete total class.",
    );
  }
};