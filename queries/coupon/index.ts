"use server";

import { db } from "@/prisma/db";
import { couponSchema, CouponFormData, couponFormToDb } from "@/schemas/coupon";
import { handleValidationError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const getAllCoupons = async () => {
  try {
    return await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    throw new Error("Failed to fetch coupons");
  }
};

export const getCouponById = async (id: string) => {
  try {
    return await db.coupon.findUnique({ where: { id } });
  } catch (error) {
    throw new Error("Failed to fetch coupon by ID");
  }
};

export const createCoupon = async (data: CouponFormData) => {
  try {
    const parsed = couponSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(JSON.stringify(handleValidationError(parsed.error)));
    }
    const coupon = await db.coupon.create({
      data: couponFormToDb(parsed.data),
    });
    revalidatePath("/", "layout");
    return coupon;
  } catch (error) {
    throw new Error(
      `Failed to create coupon: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

export const updateCoupon = async (id: string, data: CouponFormData) => {
  try {
    const parsed = couponSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(JSON.stringify(handleValidationError(parsed.error)));
    }
    const coupon = await db.coupon.update({
      where: { id },
      data: couponFormToDb(parsed.data),
    });
    // Revalidate the coupons list page to reflect the changes
    revalidatePath("/", "layout");
    return coupon;
  } catch (error) {
    throw new Error(
      `Failed to update coupon: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

export const updateCouponStatus = async (id: string, status: boolean) => {
  try {
    const coupon = await db.coupon.update({
      where: { id },
      data: { isActive: status },
    });
    revalidatePath("/", "layout");
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    return coupon;
  } catch (error) {
    throw new Error(
      `Failed to update coupon status: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

export const deleteCoupon = async (id: string) => {
  try {
    const coupon = await db.coupon.delete({ where: { id } });
    revalidatePath("/", "layout");
    return coupon;
  } catch (error) {
    throw new Error("Failed to delete coupon");
  }
};
