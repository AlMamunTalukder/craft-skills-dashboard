"use server";

import { db } from "@/prisma/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllImages = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [images, total] = await Promise.all([
    db.image.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.image.count(),
  ]);

  return {
    images,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};

export const deleteImage = async (imageId: string) => {
  const image = await db.image.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    throw new Error("Image not found.");
  }

  await cloudinary.uploader.destroy(image.publicId);

  await db.image.delete({
    where: { id: imageId },
  });

  return {
    success: true,
    message: "Image deleted successfully.",
  };
};
