"use server";

import { db } from "@/prisma/db";

export const applyCoupon = async (
  code: string,
  courseId: string,
): Promise<{
  valid: boolean;
  discountAmount: number;
  discountType: string;
  message: string;
  finalPrice?: number;
}> => {
  // First, find the course by ID to get the actual price
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    return {
      valid: false,
      discountAmount: 0,
      discountType: "NONE",
      message: "Course not found.",
    };
  }

  // Calculate the course price after discount and payment charge
  const discountedPrice = course.price - (course.price * course.discount) / 100;
  const totalPrice = Math.round(discountedPrice + course.paymentCharge);

  // Find the coupon
  const coupon = await db.coupon.findFirst({
    where: {
      code,
      isActive: true,
      validFrom: { lte: new Date() },
      validTo: { gte: new Date() },
    },
  });

  if (!coupon) {
    return {
      valid: false,
      discountAmount: 0,
      discountType: "NONE",
      message: "Invalid or expired coupon.",
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = Math.round((totalPrice * coupon.discount) / 100);
  } else if (coupon.discountType === "AMOUNT") {
    discountAmount = Math.min(coupon.discount, totalPrice); // Can't discount more than the total price
  }

  const finalPrice = Math.max(0, totalPrice - discountAmount);

  return {
    valid: true,
    discountAmount,
    discountType: coupon.discountType,
    message: "Coupon applied successfully!",
    finalPrice,
  };
};
