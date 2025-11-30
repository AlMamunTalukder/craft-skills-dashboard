"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export const getBatches = async () => {
  try {
    const batches = await db.batch.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: {
        code: "desc",
      },
    });
    return batches;
  } catch (error) {
    throw new Error("Failed to fetch batches");
  }
};



// In your server action or API route
export const getAttendanceRoutines = async () => {
  try {
    const routines = await db.attendanceRoutine.findMany({
      include: {
        batch: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return the data AS-IS without transformation
    return routines;
  } catch (error) {
    console.error("Error fetching attendance routines:", error);
    throw new Error("Failed to fetch attendance routines");
  }
};

export const getAttendanceRoutineById = async (id: string) => {
  try {
    const attendanceRoutine = await db.attendanceRoutine.findUnique({
      where: { id },
      include: {
        batch: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      }
    });
    return attendanceRoutine;
  } catch (error) {
    console.error("Error fetching attendance routine:", error);
    return null;
  }
};

export const createAttendenceDateRoutine = async (data: {
  batchId: string;
  batchCode: string;
  classes: Array<{
    className: string;
    type: "main" | "special" | "guest";
    guestName?: string;
  }>;
  isActive?: boolean;
}) => {
  try {
    console.log("📝 Creating attendance routine with data:", data);

    // Generate sessions for each class based on type
    const classesWithSessions = data.classes.map(classItem => {
      const baseSessions = [
        {
          type: "main class",
          name: "Main Class",
          date: "" // Empty date for student to fill
        },
        {
          type: "problem solving class", 
          name: "Problem Solving Class",
          date: "" // Empty date for student to fill
        },
        {
          type: "practice class",
          name: "Practice Class", 
          date: "" // Empty date for student to fill
        }
      ];

      return {
        className: classItem.className,
        type: classItem.type,
        guestName: classItem.guestName,
        sessions: baseSessions
      };
    });

    console.log("📦 Processed classes with sessions:", classesWithSessions);

    if (classesWithSessions.length === 0) {
      throw new Error("No classes provided");
    }

    const routine = await db.attendanceRoutine.create({
      data: {
        batchId: data.batchId,
        batchCode: data.batchCode,
        totalClasses: classesWithSessions.length,
        classes: classesWithSessions,
        isActive: data.isActive ?? true,
      },
    });
    
    console.log("✅ Created routine:", routine.id);
    revalidatePath("/dashboard/attendancemainclass/list");
    return routine;
  } catch (error) {
    console.error("❌ Database error:", error);
    throw new Error("Failed to create attendance routine");
  }
};

export const updateAttendenceDateRoutine = async (
  id: string,
  data: {
    batchId: string;
    batchCode: string;
    classes: Array<{
      className: string;
      type: "main" | "special" | "guest";
      guestName?: string;
    }>;
    isActive?: boolean;
  }
) => {
  try {
    console.log("📝 Updating attendance routine with data:", data);

    // Generate sessions for each class based on type
    const classesWithSessions = data.classes.map(classItem => {
      const baseSessions = [
        {
          type: "main class",
          name: "Main Class",
          date: "" // Empty date for student to fill
        },
        {
          type: "problem solving class", 
          name: "Problem Solving Class",
          date: "" // Empty date for student to fill
        },
        {
          type: "practice class",
          name: "Practice Class", 
          date: "" // Empty date for student to fill
        }
      ];

      return {
        className: classItem.className,
        type: classItem.type,
        guestName: classItem.guestName,
        sessions: baseSessions
      };
    });

    console.log("📦 Processed classes for update:", classesWithSessions);

    if (classesWithSessions.length === 0) {
      throw new Error("No classes provided");
    }

    const routine = await db.attendanceRoutine.update({
      where: { id },
      data: {
        batchId: data.batchId,
        batchCode: data.batchCode,
        totalClasses: classesWithSessions.length,
        classes: classesWithSessions,
        isActive: data.isActive ?? true,
      },
    });
    
    console.log("✅ Updated routine:", routine.id);
    revalidatePath("/dashboard/attendancemainclass/list");
    return routine;
  } catch (error) {
    console.error("❌ Database error:", error);
    throw new Error("Failed to update attendance routine");
  }
};

export const deleteAttendanceRoutine = async (id: string) => {
  try {
    const routine = await db.attendanceRoutine.delete({
      where: { id },
    });
    
    revalidatePath("/dashboard/attendancemainclass/list");
    return routine;
  } catch (error) {
    console.error("Error deleting attendance routine:", error);
    throw new Error("Failed to delete attendance routine");
  }
};

export const toggleAttendenceDateRoutineStatus = async (id: string) => {
  try {
    const routine = await db.attendanceRoutine.findUnique({
      where: { id },
    });

    if (!routine) {
      throw new Error("Attendance date routine not found");
    }

    const updatedRoutine = await db.attendanceRoutine.update({
      where: { id },
      data: {
        isActive: !routine.isActive,
      },
    });

    revalidatePath("/dashboard/attendancemainclass/list");
    return updatedRoutine;
  } catch (error) {
    throw new Error("Failed to toggle attendance date routine status");
  }
};