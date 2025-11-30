"use server";

import { handleValidationError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { CreateFolderSchema } from "@/schemas/gallery";
import { Folder, Prisma } from "@prisma/client";
import slugify from "slugify";

export const createFolder = async (data: Partial<Folder>) => {
  try {
    const parsedData = CreateFolderSchema.safeParse(data);

    if (!parsedData.success) {
      const errorMessages = handleValidationError(parsedData.error);
      throw new Error(JSON.stringify(errorMessages));
    }

    // Create folder logic here
    const slug = slugify(parsedData.data.name, { lower: true });
    const folder = await db.folder.create({
      data: {
        ...parsedData.data,
        slug,
      },
      select: {
        name: true,
        slug: true,
      },
    });

    return folder;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(
          JSON.stringify(["A folder with this name already exists."]),
        );
      }
    }
    throw error;
  }
};

export const getAllFolders = async () => {
  const folders = await db.folder.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return folders;
};

export const updateFolder = async ({
  data,
  id,
}: {
  data: Partial<Folder>;
  id: string;
}) => {
  try {
    const parsedData = CreateFolderSchema.safeParse(data);

    if (!parsedData.success) {
      const errorMessages = handleValidationError(parsedData.error);
      throw new Error(JSON.stringify(errorMessages));
    }

    // Update folder logic here
    const folder = await db.folder.update({
      where: {
        id: id,
      },
      data: {
        ...parsedData.data,
      },

      select: {
        name: true,
        slug: true,
      },
    });

    return folder;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(
          JSON.stringify(["A folder with this name already exists."]),
        );
      }
    }
    throw error;
  }
};

export const getFolderById = async (id: string) => {
  const folder = await db.folder.findUnique({
    where: {
      id,
    },
  });

  return folder;
};

export const deleteFolder = async (id: string) => {
  try {
    const folder = await db.folder.delete({
      where: {
        id,
      },
    });

    return folder;
  } catch (error) {
    throw error;
  }
};

export const getFolderBySlug = async (
  slug: string,
  page: number = 1,
  limit: number = 20,
) => {
  const folder = await db.folder.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!folder) return null;

  const totalImages = await db.image.count({
    where: { folderId: folder.id },
  });

  const images = await db.image.findMany({
    where: { folderId: folder.id },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    ...folder,
    images,
    totalImages,
    totalPages: Math.ceil(totalImages / limit),
    currentPage: page,
  };
};
