"use server";

import { db } from "@/prisma/db";
import { handleValidationError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Reviews } from "@prisma/client";

// Get all reviews
export const getAllReviews = async () => {
  try {
    const reviews = await db.reviews.findMany({
      select: {
        id: true,
        image: true,
      },
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews.");
  }
};

// Get a single review by ID
export const getReviewById = async (id: string) => {
  try {
    const review = await db.reviews.findUnique({
      where: { id },
      select: {
        id: true,
        image: true,
      },
    });
    return review;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw new Error("Failed to fetch review.");
  }
};

// Create a new review
export const createReview = async (data: Partial<Reviews>) => {
  try {
    const review = await db.reviews.create({
      data: {
        image: data.image || "",
      },
      select: {
        id: true,
        image: true,
      },
    });
    return review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Failed to create review.");
  }
};

// Update an existing review
export const updateReview = async ({
  data,
  id,
}: {
  data: Partial<Reviews>;
  id: string;
}) => {
  try {
    const review = await db.reviews.update({
      where: { id },
      data: {
        image: data.image || "",
      },
      select: {
        id: true,
        image: true,
      },
    });
    return review;
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error("Failed to update review.");
  }
};

// Delete a review
export const deleteReview = async (id: string) => {
  try {
    const review = await db.reviews.delete({
      where: { id },
      select: {
        id: true,
        image: true,
      },
    });
    revalidatePath("/", "layout");
    return review;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review.");
  }
};
