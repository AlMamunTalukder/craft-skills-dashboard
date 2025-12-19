// src/utils/format.ts
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳').trim();
};

export const calculateDiscountedPrice = (price: number, discount: number): number => {
  return price - (price * discount) / 100;
};

export const calculateTotalPrice = (price: number, discount: number, paymentCharge: number): number => {
  const discountedPrice = calculateDiscountedPrice(price, discount);
  return discountedPrice + paymentCharge;
};