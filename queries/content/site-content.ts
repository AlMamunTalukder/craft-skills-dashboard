"use server";

import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { siteContentSchema } from "@/schemas/content/site-content";
import { SiteContent } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateSiteContent = async ({
  data,
  id,
}: {
  data: Partial<SiteContent>;
  id: string;
}) => {
  const parsedData = siteContentSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = handleValidationError(parsedData.error);
    throw new Error(JSON.stringify(errorMessages));
  }

  try {
    const updatedContent = await db.siteContent.update({
      where: { id },
      data: parsedData.data,
    });
    revalidatePath("/", "layout");
    return updatedContent;
  } catch (error) {
    console.error("Error updating site content:", error);
    throw new Error("Failed to update site content.");
  }
};
