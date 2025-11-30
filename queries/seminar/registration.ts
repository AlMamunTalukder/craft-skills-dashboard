"use server";

import { SeminarRegistrationFormData } from "@/components/Forms/SeminarRegistrationForm";
import { appendDataToGoogleSheet } from "@/lib/googleSheets";
import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { seminarFormSchema } from "@/schemas/seminar/registration";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
 
dayjs.extend(utc);
dayjs.extend(timezone);

const bdDate = dayjs().tz("Asia/Dhaka").toDate();

type FormData = {
  data: SeminarRegistrationFormData;
  seminarId: string | undefined;
};

export const seminarRegistration = async (
  data: FormData["data"],
  seminarId: FormData["seminarId"],
) => {
  const parsedData = seminarFormSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error("Validation failed: " + JSON.stringify(errorMessages));
  }

  try {
    // Check if already registered with this email for the same seminar

    // Check if seminar exists
    const seminarExists = await db.seminar.findUnique({
      where: {
        id: seminarId,
      },
    });

    if (!seminarExists) {
      return {
        error: {
          message: "Seminar not found",
          code: "SEMINAR_NOT_FOUND",
        },
      };
    }

    await db.participant.create({
      data: {
        name: parsedData.data.name,
        phone: parsedData.data.phone,
        whatsapp: parsedData.data.whatsapp,
        email: parsedData.data.email,
        occupation: parsedData.data.occupation,
        seminarId: seminarId as string,
        address: parsedData.data.address,
        registeredAt: bdDate,
      },
    });

    // const registrationDate = dayjs(bdDate).format("MMMM D, YYYY, h:mm A");

    const registrationDate = dayjs()
      .tz("Asia/Dhaka")
      .format("MMMM D, YYYY, h:mm A");

    await appendDataToGoogleSheet(
      `${seminarExists.sl}-রেজিস্ট্রেশন`,
      [
        "Name",
        "Phone",
        "WhatsApp",
        "Email",
        "Occupation",
        "Address",
        "Registered At",
      ],
      [
        parsedData.data.name,
        parsedData.data.phone,
        parsedData.data.whatsapp,
        parsedData.data.email,
        parsedData.data.occupation,
        parsedData.data.address,
        registrationDate,
      ],
    );
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Failed to create seminar.",
        code: "REGISTRATION_ERROR",
      },
    };
  }
};
