"use server";

import { CourseRegistrationFormData } from "@/components/Forms/Course/RegistrationForm";
import { appendDataToGoogleSheet } from "@/lib/googleSheets";
import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { courseRegistrationSchema } from "@/schemas/course/registration";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const bdDate = dayjs().tz("Asia/Dhaka").toDate();

type FormData = {
  data: CourseRegistrationFormData;
  batchId: string | undefined;
};

export const courseRegistration = async (
  data: FormData["data"],
  batchId: FormData["batchId"],
  coupon: string,
) => {
  const parsedData = courseRegistrationSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error("Validation failed: " + JSON.stringify(errorMessages));
  }

  try {
    const batchExists = await db.batch.findUnique({
      where: {
        id: batchId,
      },
    });

    if (!batchExists) {
      throw new Error("Invalid batch selection. Please try again.");
    }

    const courseInfo = await db.course.findUnique({
      where: {
        id: parsedData.data.course.value,
      },
    });

    if (!courseInfo) {
      throw new Error("Invalid course selection. Please try again.");
    }

    const amount = Number(parsedData.data.amount || 0);

    const student = await db.student.create({
      data: {
        name: parsedData.data.name,
        phone: parsedData.data.phone,
        whatsapp: parsedData.data.whatsapp || parsedData.data.phone,
        email: parsedData.data.email,
        facebook: parsedData.data.facebook,
        coupon: parsedData.data.couponCode || "",
        amount: amount,
        paymentStatus: "PENDING",
        paymentMethod: parsedData.data.paymentMethod.value || "N/A",
        senderNumber: parsedData.data.senderNumber,
        batchId: batchId as string,
        courseId: parsedData.data.course.value as string,
      },
    });

    const registrationDate = dayjs()
      .tz("Asia/Dhaka")
      .format("MMMM D, YYYY, h:mm A");

    await appendDataToGoogleSheet(
      `${batchExists.name}-রেজিস্ট্রেশন`,
      [
        "Name",
        "Phone",
        "WhatsApp",
        "Email",
        "Facebook",
        "Course",
        "Batch",
        "Coupon Code",
        "Amount",
        "Payment Method",
        "Sender Number",
        "Registered At",
      ],
      [
        parsedData.data.name,
        parsedData.data.phone,
        parsedData.data.whatsapp || "N/A",
        parsedData.data.email,
        parsedData.data.facebook || "N/A",
        parsedData.data.course.label || "N/A",
        batchExists.name,
        parsedData.data.couponCode || "N/A",
        amount.toString(),
        parsedData.data.paymentMethod.value || "N/A",
        parsedData.data.senderNumber || "N/A",
        registrationDate,
      ],
    );

    revalidatePath("/", "layout");
    return {
      success: true,
      studentId: student.id,
      message: "Registration successful!",
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to complete registration.",
    );
  }
};
