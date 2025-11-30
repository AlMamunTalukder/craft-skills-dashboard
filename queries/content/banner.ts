"use server";

import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { bannerSchema } from "@/schemas/content/banner";
import { Banner } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateBanner = async ({
  data,
  id,
}: {
  data: Partial<Banner>;
  id: string;
}) => {
  const parsedData = bannerSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const updatedContent = await db.banner.update({
      where: { id },
      data: {
        ...parsedData.data,
        isActive: true,
      },
    });
    revalidatePath("/", "layout");
    return updatedContent;
  } catch (error) {
    console.error("Error updating site content:", error);
    throw new Error("Failed to update site content.");
  }
};
