"use server";

import { SeminarFormData } from "@/components/Forms/SeminarForm";
import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { seminarSchema } from "@/schemas/seminar";
import { revalidatePath } from "next/cache";

const getBangladeshTime = () => {
  const now = new Date();
  // Convert to Bangladesh timezone (UTC+6)
  const bangladeshOffset = 6 * 60;
  const utcOffset = now.getTimezoneOffset();

  // Adjust the date by the difference between Bangladesh and server timezone
  const offsetDiff = utcOffset + bangladeshOffset;
  now.setMinutes(now.getMinutes() + offsetDiff);

  return now;
};

export const activeSeminar = async () => {
  try {
    const now = getBangladeshTime();
    const seminar = await db.seminar.findFirst({
      where: {
        isActive: true,
        date: {
          gte: now,
        },
      },
    });
    if (seminar) {
      return seminar;
    }
    return null;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch active seminar.",
    );
  }
};

export const getAllSeminars = async () => {
  try {
    const seminars = await db.seminar.findMany({});
    return seminars;
  } catch (error) {
    console.error("Error fetching seminars:", error);
    throw new Error("Failed to fetch seminars.");
  }
};

export const createSeminar = async (data: SeminarFormData) => {
  const parsedData = seminarSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const seminar = await db.seminar.create({
      data: parsedData.data,
    });
    revalidatePath("/", "layout");

    return seminar;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create seminar.",
    );
  }
};

export const getSeminarById = async (id: string) => {
  try {
    const seminar = await db.seminar.findUnique({
      where: { id },
    });
    return seminar;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch seminar.",
    );
  }
};

export const getSeminarDetails = async (id: string) => {
  try {
    const seminar = await db.seminar.findUnique({
      where: { id },
      include: {
        participants: {},
      },
    });
    return seminar;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch seminar.",
    );
  }
};

export const updateSeminar = async ({
  id,
  data,
}: {
  id: string;
  data: SeminarFormData;
}) => {
  const parsedData = seminarSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    // Check if the seminar exists
    const seminarExists = await db.seminar.findUnique({
      where: { id },
    });

    if (!seminarExists) {
      throw new Error("The seminar does not exist.");
    }

    const seminar = await db.seminar.update({
      where: { id },
      data: parsedData.data,
    });
    revalidatePath("/", "layout");
    return seminar;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update seminar.",
    );
  }
};

export const updateSeminarIsActive = async (id: string, isActive: boolean) => {
  try {
    // Check if the seminar exists
    const seminar = await db.seminar.findUnique({
      where: { id },
    });

    if (!seminar) {
      throw new Error("The seminar does not exist.");
    }

    // If trying to activate this seminar
    if (isActive) {
      // Check if another seminar is already active
      const otherActiveSeminar = await db.seminar.findFirst({
        where: {
          id: { not: id },
          isActive: true,
        },
      });

      if (otherActiveSeminar) {
        throw new Error(
          "Another seminar is already active. Please deactivate it first.",
        );
      }
    }

    // Now update the seminar status freely (even if deactivating last one — that's allowed)
    await db.seminar.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    console.error("Error updating seminar status:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to update seminar status.",
    );
  }
};

export const deleteSeminar = async (id: string) => {
  try {
    // Check if the seminar exists
    const seminar = await db.seminar.findUnique({
      where: { id },
      include: { participants: true }, // include related entries
    });

    if (!seminar) {
      throw new Error("The seminar does not exist.");
    }

    // Check if the seminar is active

    if (seminar.isActive) {
      throw new Error(
        "Cannot delete an active seminar. Please deactivate it first.",
      );
    }

    if (seminar.isActive) {
      throw new Error(
        "Cannot delete an active seminar. Please deactivate it first.",
      );
    }

    // First delete related ParticipantToSeminar entries
    await db.participant.deleteMany({
      where: {
        seminarId: id,
      },
    });

    // Now delete the seminar
    const deletedSeminar = await db.seminar.delete({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath("/", "layout");
    return deletedSeminar;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete seminar.",
    );
  }
};
