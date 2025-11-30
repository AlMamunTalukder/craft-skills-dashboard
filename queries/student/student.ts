"use server";

import { db } from "@/prisma/db";
import { Student, Batch, Course, StudentAttendance, AttendanceRoutine } from "@prisma/client";

export const getStudentByUserId = async (userId: string) => {
  try {
    const student = await db.student.findFirst({
      where: { userId },
      include: {
        batch: true,
        course: true,
        StudentCategory: true,
      },
    });

    if (!student) {
      return null; 
    }

    return student;
  } catch (error) {
    throw new Error(
      `Failed to fetch student data: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getStudentById = async (studentId: string) => {
  try {
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        batch: true,
        course: true,
        StudentCategory: true,
       user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            
          },
        },
      },
    });

    return student;
  } catch (error) {
    throw new Error(
      `Failed to fetch student: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export async function getStudentWithAttendance(studentId: string, attendanceRoutineId: string) {
  return await db.student.findUnique({
    where: { id: studentId },
    include: {
      batch: true,
      course: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
      attendances: {
        where: {
          attendanceRoutineId: attendanceRoutineId
        },
        include: {
          attendanceRoutine: true
        }
      }
    }
  });
}


export const deleteStudent = async (id: string) => {
  try {
    await db.student.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, error: "Failed to delete student" };
  }
};

// In your types file or at the top of the component
export interface StudentWithAttendance extends Student {
  batch?: Partial<Batch>; 
  course?: Partial<Course>;
  user?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    image?: string | null;
  } | null;
  attendances?: (StudentAttendance & {
    attendanceRoutine: AttendanceRoutine;
  })[];
}