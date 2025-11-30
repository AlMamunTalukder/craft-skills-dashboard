"use server";

import { BatchFormData } from "@/components/Forms/Course/BatchForm";
import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { batchSchema } from "@/schemas/course/batch";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

export const createBatch = async (data: BatchFormData) => {
  const parsedData = batchSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }
  try {
    const batch = await db.batch.create({
      data: {
        name: parsedData.data.name,
        code: parsedData.data.code,
        description: parsedData.data.description,
        registrationStart: parsedData.data.registrationStart,
        registrationEnd: parsedData.data.registrationEnd,
        isActive: parsedData.data.isActive,
        facebookSecretGroup: parsedData.data.facebookSecretGroup || null,
        // whatsappSecretGroup: parsedData.data.whatsappSecretGroup || null,
        messengerSecretGroup: parsedData.data.messengerSecretGroup || null,
        // facebookPublicGroup: parsedData.data.facebookPublicGroup || null,
        // whatsappPublicGroup: parsedData.data.whatsappPublicGroup || null,
        // telegramGroup: parsedData.data.telegramGroup || null,
      },
    });
    revalidatePath("/", "layout");
    return batch;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create batch.",
    );
  }
};

export const updateBatch = async ({
  id,
  data,
}: {
  id: string;
  data: BatchFormData;
}) => {
  const parsedData = batchSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const updated = await db.batch.update({
      where: { id },
      data: {
        name: parsedData.data.name,
        code: parsedData.data.code,
        description: parsedData.data.description,
        registrationStart: parsedData.data.registrationStart,
        registrationEnd: parsedData.data.registrationEnd,
        isActive: parsedData.data.isActive,
        facebookSecretGroup: parsedData.data.facebookSecretGroup || null,
        // whatsappSecretGroup: parsedData.data.whatsappSecretGroup || null,
        messengerSecretGroup: parsedData.data.messengerSecretGroup || null,
        // facebookPublicGroup: parsedData.data.facebookPublicGroup || null,
        // whatsappPublicGroup: parsedData.data.whatsappPublicGroup || null,
        // telegramGroup: parsedData.data.telegramGroup || null,
      },
    });
    revalidatePath("/", "layout");
    return updated;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update batch.",
    );
  }
};

export const deleteBatch = async (id: string) => {
  try {
    // Check if the batch exists
    const batch = await db.batch.findUnique({ where: { id } });
    if (!batch) throw new Error("This batch does not exist.");

    // delete the students associated with the batch
    await db.student.deleteMany({ where: { batchId: id } });

    // delete the batch

    await db.batch.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete batch.",
    );
  }
};

export const getBatch = async (id: string) => {
  try {
    const batch = await db.batch.findUnique({
      where: { id },
      include: {
        students: true,
      },
    });

    if (!batch) throw new Error("This batch does not exist.");

    return batch;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to get batch.",
    );
  }
};

export const getBatches = async () => {
  try {
    const batches = await db.batch.findMany({
      include: {
        students: true,
      },
      orderBy: {
        isActive: "desc",
      },
    });

    return batches;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch batches.",
    );
  }
};

export const getBatchWithStudentsAndAttendance = async (
  batchId: string,
  attendanceRoutineId: string,
) => {
  try {
    const batch = await db.batch.findUnique({
      where: { id: batchId },
      include: {
        students: {
          include: {
            batch: {
              select: {
                id: true,
                name: true,
                code: true,
                // Add all required fields from Batch model
                createdAt: true,
                updatedAt: true,
                courseId: true,
                isActive: true,
                description: true,
                registrationStart: true,
                registrationEnd: true,
                facebookSecretGroup: true,
                whatsappSecretGroup: true,
                messengerSecretGroup: true,
                facebookPublicGroup: true,
                whatsappPublicGroup: true,
                telegramGroup: true,
              },
            },
            course: {
              select: {
                id: true,
                name: true,
                // Add course fields if needed
                description: true,
                price: true,
                discount: true,
                paymentCharge: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            attendances: {
              where: {
                attendanceRoutineId: attendanceRoutineId,
              },
              include: {
                attendanceRoutine: true,
              },
            },
          },
        },
      },
    });
    return batch;
  } catch (error) {
    console.error("Error fetching batch with students and attendance:", error);
    return null;
  }
};

export const updateBatchIsActive = async (id: string, isActive: boolean) => {
  try {
    if (isActive) {
      // Check if another batch is already active
      const otherActiveBatch = await db.batch.findFirst({
        where: {
          id: { not: id },
          isActive: true,
        },
      });

      if (otherActiveBatch) {
        throw new Error(
          "Another batch is already active. Please deactivate it first.",
        );
      }
    }

    const batch = await db.batch.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/", "layout");
    return batch;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update batch.",
    );
  }
};

export const getActiveBatch = async () => {
  try {
    // Helper function to get current Bangladesh time
    const getBangladeshTime = () => {
      const now = new Date();
      // Convert to Bangladesh timezone (UTC+6)
      const bangladeshOffset = 6 * 60; // 6 hours ahead of UTC in minutes
      const utcOffset = now.getTimezoneOffset(); // Server's offset from UTC in minutes

      // Adjust the date by the difference between Bangladesh and server timezone
      const offsetDiff = utcOffset + bangladeshOffset;
      now.setMinutes(now.getMinutes() + offsetDiff);

      return now;
    };

    const now = getBangladeshTime();

    // STEP 1: Find currently active batch
    const currentBatch = await db.batch.findFirst({
      where: { isActive: true },
    });

    if (currentBatch) {
      const start = new Date(currentBatch.registrationStart);
      const end = new Date(currentBatch.registrationEnd);

      // If current date is within the batch range, return it
      if (now >= start && now <= end) {
        return currentBatch;
      }

      // Deactivate if the batch is expired
      await db.batch.update({
        where: { id: currentBatch.id },
        data: { isActive: false },
      });
    }

    // STEP 2: Activate the next upcoming batch
    const nextBatch = await db.batch.findFirst({
      where: {
        isActive: false,
        registrationEnd: { gte: now },
      },
      orderBy: { registrationStart: "asc" },
    });

    if (nextBatch) {
      await db.batch.update({
        where: { id: nextBatch.id },
        data: { isActive: true },
      });
      return nextBatch;
    }

    // STEP 3: Create a new default batch if none exists
    const defaultStart = getBangladeshTime();
    const defaultEnd = getBangladeshTime();
    defaultEnd.setMonth(defaultEnd.getMonth() + 1); // 1 month from now

    const newBatch = await db.batch.create({
      data: {
        name: `Auto-generated Batch ${format(
          getBangladeshTime(),
          "yyyy-MM-dd",
        )}`,
        code: Math.floor(1000 + Math.random() * 9000), // Random 4-digit code
        description: "Auto-generated description",
        registrationStart: defaultStart,
        registrationEnd: defaultEnd,
        isActive: true,
      },
    });

    return newBatch;
  } catch (error) {
    return null;
  }
};
